const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const parcelCollection = () => getDB().collection("parcels");
const trackingCollection = () => getDB().collection("tracking");
const paymentsCollection = () => getDB().collection("payments");
const usersCollection = () => getDB().collection("users");

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const isSameRoute = (parcel) => {
  const origin = normalizeText(parcel?.senderDistrict || parcel?.senderServiceCenter || parcel?.senderRegion);
  const destination = normalizeText(parcel?.receiverDistrict || parcel?.receiverServiceCenter || parcel?.receiverRegion);
  return !!origin && origin === destination;
};

const generateTrackingNo = async () => {
  for (let i = 0; i < 40; i += 1) {
    const candidate = `${Math.floor(100000 + Math.random() * 900000)}`;
    const exists = await parcelCollection().findOne({ trackingNo: candidate }, { projection: { _id: 1 } });
    if (!exists) return candidate;
  }

  return `${Date.now()}`.slice(-6);
};

const statusMessageMap = {
  pending: "Parcel booking created.",
  paid: "Payment completed successfully.",
  "ready-to-pickup": "Parcel assigned for pickup.",
  "in-transit": "Parcel picked up and in transit.",
  "reached-service-center": "Parcel reached destination service center.",
  shipped: "Parcel shipped from service center.",
  "ready-for-delivery": "Parcel assigned for final delivery.",
  delivered: "Parcel delivered successfully.",
  failed: "Delivery marked as failed.",
  damaged: "Parcel marked as damaged.",
};

const createTrackingDoc = async ({ parcel, status, message, actorEmail, actorRole, meta = {} }) => {
  if (!parcel?._id) return;

  await trackingCollection().insertOne({
    parcelId: parcel._id,
    trackingNo: parcel.trackingNo || null,
    senderEmail: parcel.senderEmail || "",
    status,
    message: message || statusMessageMap[status] || "Parcel status updated.",
    actorEmail: actorEmail || "system@zapshift.local",
    actorRole: actorRole || "system",
    createdAt: new Date(),
    meta,
  });
};

const assertParcelAccess = (parcel, role, requesterEmail) => {
  if (role === "admin") return true;

  if (role === "rider") {
    return parcel.pickupRiderEmail === requesterEmail || parcel.deliveryRiderEmail === requesterEmail;
  }

  return parcel.senderEmail === requesterEmail;
};

// CREATE
exports.createParcel = async (req, res) => {
  const data = req.body;
  data.senderEmail = req.decoded?.email;

  data.status = "pending";
  data.paymentStatus = "unpaid";
  data.createdAt = new Date();

  const result = await parcelCollection().insertOne(data);

  await createTrackingDoc({
    parcel: { ...data, _id: result.insertedId },
    status: "pending",
    actorEmail: req.decoded?.email,
    actorRole: req.userRole || req.decoded?.role || "user",
    message: "Parcel booking submitted and awaiting payment.",
  });

  res.send(result);
};

// GET
exports.getParcels = async (req, res) => {
  const { email } = req.query;
  const requesterEmail = req.decoded?.email;
  const role = (req.userRole || req.decoded?.role || "user").toLowerCase();
  const query = {};

  if (role === "admin") {
    if (email) {
      query.senderEmail = email;
    }
  } else if (role === "rider") {
    query.$or = [{ pickupRiderEmail: requesterEmail }, { deliveryRiderEmail: requesterEmail }];
  } else {
    if (email && email !== requesterEmail) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    query.senderEmail = requesterEmail;
  }

  const result = await parcelCollection().find(query).toArray();
  res.send(result);
};

// GET SINGLE
exports.getParcelById = async (req, res) => {
  const { id } = req.params;
  const requesterEmail = req.decoded?.email;
  const role = (req.userRole || req.decoded?.role || "user").toLowerCase();
  try {
    const result = await parcelCollection().findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if (role === "rider") {
      const isAssignedRider = result.pickupRiderEmail === requesterEmail || result.deliveryRiderEmail === requesterEmail;
      if (!isAssignedRider) {
        return res.status(403).send({ message: "Forbidden access" });
      }
    }

    if (role === "user" && result.senderEmail !== requesterEmail) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    res.send(result);
  } catch (error) {
    res.status(400).send({ message: "Invalid parcel id" });
  }
};

// PAYMENT UPDATE
exports.payParcel = async (req, res) => {
  const { id } = req.params;
  const { transactionId } = req.body;
  const requesterEmail = req.decoded?.email;
  const role = (req.userRole || req.decoded?.role || "user").toLowerCase();

  try {
    const parcel = await parcelCollection().findOne({ _id: new ObjectId(id) });
    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if (role !== "admin" && parcel.senderEmail !== requesterEmail) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    if ((parcel.paymentStatus || "").toLowerCase() === "paid") {
      const existingPayment = await paymentsCollection().findOne({ parcelId: parcel._id });
      return res.send({
        acknowledged: true,
        modifiedCount: 0,
        transactionId: parcel.transactionId || existingPayment?.transactionId || null,
        paymentStatus: "paid",
        trackingNo: parcel.trackingNo || existingPayment?.trackingNo || null,
      });
    }

    const paidAt = new Date();
    const nextTrackingNo = parcel.trackingNo || (await generateTrackingNo());
    const nextTransactionId = transactionId || `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const update = {
      paymentStatus: "paid",
      status: "paid",
      transactionId: nextTransactionId,
      trackingNo: nextTrackingNo,
      paidAt,
      updatedAt: paidAt,
    };

    const result = await parcelCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (!result.matchedCount) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    await paymentsCollection().updateOne(
      { parcelId: parcel._id },
      {
        $set: {
          parcelId: parcel._id,
          trackingNo: nextTrackingNo,
          transactionId: nextTransactionId,
          amount: Number(parcel.amount) || 0,
          senderEmail: parcel.senderEmail || requesterEmail,
          paymentStatus: "paid",
          paidAt,
          updatedAt: paidAt,
        },
        $setOnInsert: {
          createdAt: paidAt,
        },
      },
      { upsert: true }
    );

    await createTrackingDoc({
      parcel: { ...parcel, ...update },
      status: "paid",
      actorEmail: requesterEmail,
      actorRole: role,
      message: `Payment successful. Tracking no ${nextTrackingNo}. Transaction ${nextTransactionId}.`,
      meta: {
        transactionId: nextTransactionId,
      },
    });

    res.send({
      acknowledged: true,
      modifiedCount: result.modifiedCount,
      transactionId: nextTransactionId,
      paymentStatus: "paid",
      trackingNo: nextTrackingNo,
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid parcel id" });
  }
};

exports.getAdminStats = async (req, res) => {
  const parcels = await parcelCollection().find({}).toArray();
  const users = await getDB().collection("users").countDocuments();

  const totalIncome = parcels
    .filter((p) => (p.paymentStatus || "").toLowerCase() === "paid")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const now = new Date();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chart = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const dayParcels = parcels.filter((p) => {
      const created = p.createdAt ? new Date(p.createdAt) : null;
      return created && created.getFullYear() === y && created.getMonth() === m && created.getDate() === day;
    });

    return {
      day: dayLabels[d.getDay()],
      parcels: dayParcels.length,
      income: dayParcels
        .filter((p) => (p.paymentStatus || "").toLowerCase() === "paid")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    };
  });

  const delayed = parcels.filter((p) => {
    const status = (p.status || "").toLowerCase();
    const created = p.createdAt ? new Date(p.createdAt) : null;
    if (!created) return false;
    const ageMs = Date.now() - created.getTime();
    return ["in-transit", "processing", "shipped"].some((s) => status.includes(s)) && ageMs > 3 * 24 * 60 * 60 * 1000;
  });

  const failed = parcels.filter((p) => (p.status || "").toLowerCase().includes("failed"));
  const damaged = parcels.filter((p) => (p.status || "").toLowerCase().includes("damaged"));

  res.send({
    totals: {
      newPackages: parcels.length,
      readyForShipping: parcels.filter((p) => (p.status || "").toLowerCase() === "ready-to-pickup").length,
      completed: parcels.filter((p) => (p.status || "").toLowerCase() === "delivered").length,
      newClients: users,
      totalIncome,
    },
    chart,
    alerts: {
      delayed: delayed.length,
      failed: failed.length,
      damaged: damaged.length,
    },
  });
};

exports.getPaymentHistory = async (req, res) => {
  const paidPayments = await paymentsCollection()
    .find({ paymentStatus: "paid" })
    .sort({ paidAt: -1, createdAt: -1 })
    .toArray();

  const totalIncome = paidPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  res.send({
    totalIncome,
    transactions: paidPayments.map((payment) => ({
      parcelId: payment.parcelId,
      trackingNo: payment.trackingNo || "N/A",
      transactionId: payment.transactionId || `TX-${String(payment.parcelId || "").slice(-6).toUpperCase()}`,
      clientName: payment.senderEmail || "Unknown",
      amount: Number(payment.amount) || 0,
      paidAt: payment.paidAt || payment.createdAt,
      status: payment.paymentStatus || "paid",
    })),
  });
};

exports.updateParcelStatus = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    message,
    confirmTrackingNo,
    pickupRiderId,
    deliveryRiderId,
    pickupRiderEmail,
    deliveryRiderEmail,
    pickupRiderName,
    deliveryRiderName,
  } = req.body;
  const role = (req.userRole || req.decoded?.role || "user").toLowerCase();
  const requesterEmail = req.decoded?.email;

  const allowed = [
    "paid",
    "ready-to-pickup",
    "in-transit",
    "reached-service-center",
    "shipped",
    "ready-for-delivery",
    "delivered",
    "failed",
    "damaged",
  ];
  const targetStatus = String(status || "").toLowerCase();

  if (!allowed.includes(targetStatus)) {
    return res.status(400).send({ message: "Invalid status" });
  }

  const update = {
    status: targetStatus,
    updatedAt: new Date(),
  };

  if (pickupRiderId) update.pickupRiderId = pickupRiderId;
  if (deliveryRiderId) update.deliveryRiderId = deliveryRiderId;
  if (pickupRiderEmail) update.pickupRiderEmail = pickupRiderEmail;
  if (deliveryRiderEmail) update.deliveryRiderEmail = deliveryRiderEmail;
  if (pickupRiderName) update.pickupRiderName = pickupRiderName;
  if (deliveryRiderName) update.deliveryRiderName = deliveryRiderName;

  try {
    const parcel = await parcelCollection().findOne({ _id: new ObjectId(id) });
    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if ((parcel.paymentStatus || "unpaid").toLowerCase() !== "paid" && targetStatus !== "paid") {
      return res.status(400).send({ message: "Parcel must be paid before status updates" });
    }

    const currentStatus = String(parcel.status || "pending").toLowerCase();

    if (role === "rider") {
      const isPickupAssigned = parcel.pickupRiderEmail === requesterEmail;
      const isDeliveryAssigned = parcel.deliveryRiderEmail === requesterEmail;

      if (!confirmTrackingNo || String(confirmTrackingNo).trim() !== String(parcel.trackingNo || "")) {
        return res.status(400).send({ message: "Tracking number confirmation failed" });
      }

      if (targetStatus === "in-transit") {
        if (!isPickupAssigned) {
          return res.status(403).send({ message: "Only assigned pickup rider can confirm pickup" });
        }

        if (currentStatus !== "ready-to-pickup") {
          return res.status(400).send({ message: "Parcel is not ready for pickup" });
        }
      }

      if (targetStatus === "delivered") {
        if (!isDeliveryAssigned) {
          return res.status(403).send({ message: "Only assigned delivery rider can confirm delivery" });
        }

        if (currentStatus !== "ready-for-delivery") {
          return res.status(400).send({ message: "Parcel is not ready for delivery" });
        }
      }

      if (!["in-transit", "delivered"].includes(targetStatus)) {
        return res.status(403).send({ message: "Rider cannot set this status" });
      }
    }

    const result = await parcelCollection().updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (!result.matchedCount) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if (role === "rider" && ["in-transit", "delivered"].includes(targetStatus)) {
      await usersCollection().updateOne(
        { email: requesterEmail },
        {
          $inc: { earnings: 20 },
          $set: { updatedAt: new Date() },
        }
      );
    }

    await createTrackingDoc({
      parcel: { ...parcel, ...update },
      status: targetStatus,
      actorEmail: requesterEmail,
      actorRole: role,
      message,
    });

    res.send({ acknowledged: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(400).send({ message: "Invalid parcel id" });
  }
};

exports.assignParcelRiders = async (req, res) => {
  const { id } = req.params;
  const { pickupRiderEmail, deliveryRiderEmail } = req.body;

  if (!pickupRiderEmail || !deliveryRiderEmail) {
    return res.status(400).send({ message: "Pickup rider and delivery rider are required" });
  }

  try {
    const parcel = await parcelCollection().findOne({ _id: new ObjectId(id) });

    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if ((parcel.paymentStatus || "").toLowerCase() !== "paid") {
      return res.status(400).send({ message: "Only paid parcels can be assigned" });
    }

    const usersCollection = getDB().collection("users");
    const [pickupRider, deliveryRider] = await Promise.all([
      usersCollection.findOne({ email: pickupRiderEmail, role: "rider", riderStatus: "approved" }),
      usersCollection.findOne({ email: deliveryRiderEmail, role: "rider", riderStatus: "approved" }),
    ]);

    if (!pickupRider) {
      return res.status(404).send({ message: "Pickup rider not found or not approved" });
    }

    if (!deliveryRider) {
      return res.status(404).send({ message: "Delivery rider not found or not approved" });
    }

    const update = {
      pickupRiderId: String(pickupRider._id),
      pickupRiderEmail: pickupRider.email,
      pickupRiderName: pickupRider.name || "Rider",
      deliveryRiderId: String(deliveryRider._id),
      deliveryRiderEmail: deliveryRider.email,
      deliveryRiderName: deliveryRider.name || "Rider",
      status: "ready-to-pickup",
      updatedAt: new Date(),
    };

    const result = await parcelCollection().updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (!result.matchedCount) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    await createTrackingDoc({
      parcel: { ...parcel, ...update },
      status: "ready-to-pickup",
      actorEmail: req.decoded?.email,
      actorRole: req.userRole || req.decoded?.role || "admin",
      message: `Pickup rider assigned (${pickupRider.email}) and delivery rider assigned (${deliveryRider.email}).`,
    });

    res.send({
      acknowledged: true,
      modifiedCount: result.modifiedCount,
      parcelId: id,
      pickupRiderEmail: pickupRider.email,
      deliveryRiderEmail: deliveryRider.email,
      status: "ready-to-pickup",
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid parcel id" });
  }
};

exports.getParcelTracking = async (req, res) => {
  const { id } = req.params;
  const requesterEmail = req.decoded?.email;
  const role = (req.userRole || req.decoded?.role || "user").toLowerCase();

  try {
    const parcel = await parcelCollection().findOne({ _id: new ObjectId(id) });
    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if (!assertParcelAccess(parcel, role, requesterEmail)) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const events = await trackingCollection()
      .find({ parcelId: parcel._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      parcel,
      events,
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid parcel id" });
  }
};

exports.searchTracking = async (req, res) => {
  const { query } = req.params;
  const requesterEmail = req.decoded?.email;
  const role = (req.userRole || req.decoded?.role || "user").toLowerCase();

  const trimmed = String(query || "").trim();
  if (!trimmed) {
    return res.status(400).send({ message: "Tracking query is required" });
  }

  try {
    let parcel = null;

    if (ObjectId.isValid(trimmed)) {
      parcel = await parcelCollection().findOne({ _id: new ObjectId(trimmed) });
    }

    if (!parcel) {
      parcel = await parcelCollection().findOne({ trackingNo: trimmed });
    }

    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if (!assertParcelAccess(parcel, role, requesterEmail)) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const events = await trackingCollection()
      .find({ parcelId: parcel._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.send({ parcel, events });
  } catch (error) {
    res.status(400).send({ message: "Invalid tracking query" });
  }
};

exports.processWorkflowAction = async (req, res) => {
  const { id } = req.params;
  const { action, riderEmail } = req.body;
  const actorEmail = req.decoded?.email;
  const actorRole = (req.userRole || req.decoded?.role || "admin").toLowerCase();

  const allowedActions = ["assign-pickup", "confirm-received", "ship-parcel", "assign-delivery"];
  if (!allowedActions.includes(String(action || ""))) {
    return res.status(400).send({ message: "Invalid workflow action" });
  }

  try {
    const parcel = await parcelCollection().findOne({ _id: new ObjectId(id) });
    if (!parcel) {
      return res.status(404).send({ message: "Parcel not found" });
    }

    if ((parcel.paymentStatus || "unpaid").toLowerCase() !== "paid") {
      return res.status(400).send({ message: "Parcel must be paid first" });
    }

    const now = new Date();
    const currentStatus = String(parcel.status || "pending").toLowerCase();
    const sameRoute = isSameRoute(parcel);
    const update = { updatedAt: now };
    let trackingStatus = currentStatus;
    let trackingMessage = "Workflow updated.";

    if (action === "assign-pickup") {
      if (!riderEmail) {
        return res.status(400).send({ message: "Pickup rider email is required" });
      }

      if (currentStatus !== "paid") {
        return res.status(400).send({ message: "Pickup rider can be assigned only when status is paid" });
      }

      const pickupRider = await usersCollection().findOne({ email: riderEmail, role: "rider", riderStatus: "approved" });
      if (!pickupRider) {
        return res.status(404).send({ message: "Pickup rider not found or not approved" });
      }

      update.pickupRiderId = String(pickupRider._id);
      update.pickupRiderEmail = pickupRider.email;
      update.pickupRiderName = pickupRider.name || "Rider";

      if (sameRoute) {
        update.deliveryRiderId = String(pickupRider._id);
        update.deliveryRiderEmail = pickupRider.email;
        update.deliveryRiderName = pickupRider.name || "Rider";
      }

      update.status = "ready-to-pickup";
      trackingStatus = "ready-to-pickup";
      trackingMessage = `Pickup rider assigned (${pickupRider.email}).`;
    }

    if (action === "confirm-received") {
      if (sameRoute) {
        return res.status(400).send({ message: "This action is only for inter-district parcels" });
      }

      if (currentStatus !== "in-transit") {
        return res.status(400).send({ message: "Parcel must be in-transit to confirm received" });
      }

      update.status = "reached-service-center";
      trackingStatus = "reached-service-center";
      trackingMessage = "Parcel received at destination service center.";
    }

    if (action === "ship-parcel") {
      if (sameRoute) {
        return res.status(400).send({ message: "This action is only for inter-district parcels" });
      }

      if (currentStatus !== "reached-service-center") {
        return res.status(400).send({ message: "Parcel must reach service center before shipping" });
      }

      update.status = "shipped";
      trackingStatus = "shipped";
      trackingMessage = "Parcel shipped for final distribution.";
    }

    if (action === "assign-delivery") {
      if (!riderEmail) {
        return res.status(400).send({ message: "Delivery rider email is required" });
      }

      if (!sameRoute && currentStatus !== "shipped") {
        return res.status(400).send({ message: "Delivery rider can be assigned when status is shipped" });
      }

      if (sameRoute && !["in-transit", "ready-to-pickup", "paid"].includes(currentStatus)) {
        return res.status(400).send({ message: "Delivery rider cannot be assigned at this stage" });
      }

      const deliveryRider = await usersCollection().findOne({ email: riderEmail, role: "rider", riderStatus: "approved" });
      if (!deliveryRider) {
        return res.status(404).send({ message: "Delivery rider not found or not approved" });
      }

      update.deliveryRiderId = String(deliveryRider._id);
      update.deliveryRiderEmail = deliveryRider.email;
      update.deliveryRiderName = deliveryRider.name || "Rider";
      update.status = "ready-for-delivery";
      trackingStatus = "ready-for-delivery";
      trackingMessage = `Delivery rider assigned (${deliveryRider.email}).`;
    }

    const result = await parcelCollection().updateOne({ _id: new ObjectId(id) }, { $set: update });

    await createTrackingDoc({
      parcel: { ...parcel, ...update },
      status: trackingStatus,
      message: trackingMessage,
      actorEmail,
      actorRole,
    });

    res.send({
      acknowledged: true,
      modifiedCount: result.modifiedCount,
      status: update.status,
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid parcel id" });
  }
};