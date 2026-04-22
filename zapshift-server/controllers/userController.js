const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const usersCollection = () => getDB().collection("users");
const riderApplicationsCollection = () => getDB().collection("riderApplications");

exports.upsertUser = async (req, res) => {
  const { email, name, photoURL } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const filter = { email };
  const existing = await usersCollection().findOne(filter);

  const update = {
    $set: {
      email,
      name: name || existing?.name || "User",
      photoURL: photoURL || existing?.photoURL || "",
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    },
    $setOnInsert: {
      role: "user",
      riderStatus: "none",
      createdAt: new Date(),
    },
  };

  const result = await usersCollection().updateOne(filter, update, { upsert: true });
  res.send({ acknowledged: true, modifiedCount: result.modifiedCount, upsertedId: result.upsertedId || null });
};

exports.getUsers = async (req, res) => {
  const { role, riderStatus, search } = req.query;
  const query = {};

  if (role) query.role = role;
  if (riderStatus) query.riderStatus = riderStatus;
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ];
  }

  const result = await usersCollection().find(query).sort({ createdAt: -1 }).toArray();
  res.send(result);
};

exports.getCurrentUser = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  if (!req.decoded?.email || req.decoded.email !== email) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  const user = await usersCollection().findOne({ email });
  if (!user) {
    return res.send({ email, role: "user", riderStatus: "none" });
  }

  res.send(user);
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const allowed = ["user", "admin", "rider"];

  if (!allowed.includes(role)) {
    return res.status(400).send({ message: "Invalid role" });
  }

  try {
    const update = {
      role,
      riderStatus: role === "rider" ? "approved" : "none",
      updatedAt: new Date(),
    };

    const result = await usersCollection().updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (!result.matchedCount) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ acknowledged: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(400).send({ message: "Invalid user id" });
  }
};

exports.getRiders = async (req, res) => {
  const result = await riderApplicationsCollection().find({}).sort({ updatedAt: -1, createdAt: -1 }).toArray();
  res.send(result);
};

exports.reviewRider = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).send({ message: "Invalid action" });
  }

  try {
    const application = await riderApplicationsCollection().findOne({ _id: new ObjectId(id) });

    if (!application) {
      return res.status(404).send({ message: "Rider not found" });
    }

    const approved = action === "approve";
    const applicationUpdate = {
      applicationStatus: approved ? "approved" : "rejected",
      reviewedBy: req.decoded?.email || "",
      reviewedAt: new Date(),
      updatedAt: new Date(),
    };

    const userUpdate = {
      role: approved ? "rider" : "user",
      name: application.name || "User",
      riderStatus: approved ? "approved" : "rejected",
      updatedAt: new Date(),
    };

    const [applicationResult] = await Promise.all([
      riderApplicationsCollection().updateOne({ _id: new ObjectId(id) }, { $set: applicationUpdate }),
      usersCollection().updateOne({ email: application.email }, { $set: userUpdate }, { upsert: true }),
    ]);

    res.send({ acknowledged: true, modifiedCount: applicationResult.modifiedCount });
  } catch (error) {
    res.status(400).send({ message: "Invalid user id" });
  }
};

exports.deleteRider = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await riderApplicationsCollection().findOne({ _id: new ObjectId(id) });

    if (!application) {
      return res.status(404).send({ message: "Rider not found" });
    }

    const deleteResult = await riderApplicationsCollection().deleteOne({ _id: new ObjectId(id) });

    await usersCollection().updateOne(
      { email: application.email },
      {
        $set: {
          riderStatus: "none",
          role: "user",
          updatedAt: new Date(),
        },
      }
    );

    res.send({ acknowledged: true, deletedCount: deleteResult.deletedCount });
  } catch (error) {
    res.status(400).send({ message: "Invalid user id" });
  }
};

exports.requestRider = async (req, res) => {
  const { name, age, email, district, nid, contact, warehouse } = req.body;
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  if (!req.decoded?.email || req.decoded.email !== email) {
    return res.status(403).send({ message: "Forbidden access" });
  }

  const requiredFields = { name, age, district, nid, contact, warehouse };
  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => !String(value || "").trim())
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(400).send({ message: "All rider application fields are required", missingFields });
  }

  const application = {
    name,
    age,
    email,
    district,
    nid,
    contact,
    warehouse,
    applicationStatus: "pending",
    reviewedBy: "",
    reviewedAt: null,
    updatedAt: new Date(),
  };

  const result = await riderApplicationsCollection().updateOne(
    { email },
    {
      $set: application,
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  await usersCollection().updateOne(
    { email },
    {
      $set: {
        riderStatus: "pending",
        updatedAt: new Date(),
      },
      $setOnInsert: {
        email,
        name,
        role: "user",
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  res.send({ acknowledged: true, modifiedCount: result.modifiedCount, upsertedId: result.upsertedId || null });
};
