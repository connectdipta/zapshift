import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useParcelById from "../../hooks/useParcelById";
import axiosSecure from "../../hooks/useAxiosSecure";

const timelineOrder = ["pending", "paid", "ready-to-pickup", "in-transit", "reached-service-center", "shipped", "ready-for-delivery", "delivered"];

const ManageParcel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: parcel, isLoading, isError, refetch } = useParcelById(id);
  const [saving, setSaving] = useState(false);
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: approvedRiders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["approved-riders-for-assignment"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=rider&riderStatus=approved");
      return res.data || [];
    },
  });

  const { data: trackingPayload, refetch: refetchTracking } = useQuery({
    queryKey: ["parcel-tracking-admin", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${id}/tracking`);
      return res.data || { events: [] };
    },
  });

  const currentStatus = useMemo(() => String(parcel?.status || parcel?.normalizedStatus || "pending").toLowerCase(), [parcel]);
  const currentPaymentStatus = useMemo(() => String(parcel?.paymentStatus || "unpaid").toLowerCase(), [parcel]);
  const canManage = currentPaymentStatus === "paid";
  const sameRoute = useMemo(() => {
    const origin = String(parcel?.senderDistrict || parcel?.senderServiceCenter || "").toLowerCase();
    const destination = String(parcel?.receiverDistrict || parcel?.receiverServiceCenter || "").toLowerCase();
    return !!origin && origin === destination;
  }, [parcel]);

  const timelineEvents = trackingPayload?.events || [];

  const auditActions = useMemo(() => {
    const unique = new Set(timelineEvents.map((event) => String(event.status || "pending").toLowerCase()));
    return Array.from(unique).sort();
  }, [timelineEvents]);

  const auditUsers = useMemo(() => {
    const unique = new Set(
      timelineEvents
        .map((event) => String(event.actorEmail || "system@zapshift.local").toLowerCase())
        .filter(Boolean)
    );
    return Array.from(unique).sort();
  }, [timelineEvents]);

  const filteredTimelineEvents = useMemo(() => {
    return timelineEvents.filter((event) => {
      const status = String(event.status || "pending").toLowerCase();
      const actor = String(event.actorEmail || "system@zapshift.local").toLowerCase();
      const created = event.createdAt ? new Date(event.createdAt) : null;

      if (actionFilter !== "all" && status !== actionFilter) return false;
      if (userFilter !== "all" && actor !== userFilter) return false;

      if (dateFrom) {
        const fromDate = new Date(`${dateFrom}T00:00:00`);
        if (!created || created < fromDate) return false;
      }

      if (dateTo) {
        const toDate = new Date(`${dateTo}T23:59:59`);
        if (!created || created > toDate) return false;
      }

      return true;
    });
  }, [timelineEvents, actionFilter, userFilter, dateFrom, dateTo]);

  const riderOptions = useMemo(() => {
    const options = {};
    approvedRiders.forEach((rider) => {
      options[rider.email] = `${rider.name || "Rider"} (${rider.email})`;
    });
    return options;
  }, [approvedRiders]);

  const runWorkflowAction = async (action, riderEmail) => {
    if (!parcel) return;

    try {
      setSaving(true);
      await axiosSecure.patch(`/parcels/${parcel._id}/workflow`, {
        action,
        riderEmail,
      });

      await Swal.fire({
        icon: "success",
        title: "Workflow updated",
        text: "Parcel delivery step updated successfully.",
        confirmButtonColor: "#caeb66",
      });

      await Promise.all([refetch(), refetchTracking()]);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Action failed",
        text: error?.response?.data?.message || "Could not process this workflow action.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  const promptAssignRider = async (actionType) => {
    if (!canManage) {
      await Swal.fire({
        icon: "warning",
        title: "Payment required",
        text: "Only paid parcels can be managed.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (!approvedRiders.length) {
      await Swal.fire({
        icon: "warning",
        title: "No rider available",
        text: "No approved rider found right now.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const label = actionType === "assign-pickup" ? "pickup" : "delivery";
    const pick = await Swal.fire({
      title: `Select ${label} rider`,
      input: "select",
      inputOptions: riderOptions,
      inputPlaceholder: `Choose ${label} rider`,
      showCancelButton: true,
      confirmButtonText: "Assign",
      confirmButtonColor: "#caeb66",
      inputValidator: (value) => (!value ? `Please choose a ${label} rider` : undefined),
    });

    if (!pick.isConfirmed || !pick.value) return;
    await runWorkflowAction(actionType, pick.value);
  };

  const confirmSimpleAction = async (actionType, title, text) => {
    const result = await Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Continue",
      confirmButtonColor: "#caeb66",
    });

    if (!result.isConfirmed) return;
    await runWorkflowAction(actionType);
  };

  const renderStepCard = () => {
    const baseCard = "rounded-xl border p-4";

    if (currentPaymentStatus !== "paid") {
      return <div className={`${baseCard} border-yellow-200 bg-yellow-50 text-yellow-700`}>Parcel is unpaid. Manage actions are disabled.</div>;
    }

    if (currentStatus === "paid") {
      return (
        <div className={`${baseCard} border-[#d7e9a2] bg-[#f5fbe3]`}>
          <p className="text-sm font-semibold text-[#2b3a15]">1. Assign Parcel for Pickup</p>
          <p className="mt-1 text-xs text-[#52622b]">Choose an approved rider from origin service center.</p>
          <button disabled={saving || ridersLoading} onClick={() => promptAssignRider("assign-pickup")} className="mt-3 rounded-lg bg-[#caeb66] px-4 py-2 text-sm font-semibold text-[#111] disabled:opacity-60">Assign Pickup Rider</button>
        </div>
      );
    }

    if (currentStatus === "ready-to-pickup") {
      return <div className={`${baseCard} border-blue-200 bg-blue-50 text-blue-700`}>2. Parcel received by pickup rider. Waiting for rider pickup confirmation.</div>;
    }

    if (!sameRoute && currentStatus === "in-transit") {
      return (
        <div className={`${baseCard} border-indigo-200 bg-indigo-50`}>
          <p className="text-sm font-semibold text-indigo-800">3. Confirm Parcel Received</p>
          <p className="mt-1 text-xs text-indigo-700">Confirm the parcel reached destination service center.</p>
          <button disabled={saving} onClick={() => confirmSimpleAction("confirm-received", "Confirm Parcel Received?", "This will change status to reached-service-center.")} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Confirm Received</button>
        </div>
      );
    }

    if (!sameRoute && currentStatus === "reached-service-center") {
      return (
        <div className={`${baseCard} border-sky-200 bg-sky-50`}>
          <p className="text-sm font-semibold text-sky-800">4. Ship Parcel</p>
          <p className="mt-1 text-xs text-sky-700">Ship parcel from destination service center for final delivery allocation.</p>
          <button disabled={saving} onClick={() => confirmSimpleAction("ship-parcel", "Ship Parcel?", "This will change status to shipped.")} className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Ship Parcel</button>
        </div>
      );
    }

    if ((!sameRoute && currentStatus === "shipped") || (sameRoute && currentStatus === "in-transit")) {
      return (
        <div className={`${baseCard} border-orange-200 bg-orange-50`}>
          <p className="text-sm font-semibold text-orange-800">5. Assign Parcel for Delivery</p>
          <p className="mt-1 text-xs text-orange-700">Assign a delivery rider for last-mile delivery.</p>
          <button disabled={saving || ridersLoading} onClick={() => promptAssignRider("assign-delivery")} className="mt-3 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Assign Delivery Rider</button>
        </div>
      );
    }

    if (currentStatus === "ready-for-delivery") {
      return <div className={`${baseCard} border-emerald-200 bg-emerald-50 text-emerald-700`}>6. Parcel is ready for rider delivery confirmation.</div>;
    }

    if (currentStatus === "delivered") {
      return <div className={`${baseCard} border-green-200 bg-green-50 text-green-700`}>7. Parcel delivery completed successfully.</div>;
    }

    return <div className={`${baseCard} border-gray-200 bg-gray-50 text-gray-600`}>Current status: {currentStatus.replace(/-/g, " ")}.</div>;
  };

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-8 text-sm text-gray-600 shadow-sm">Loading parcel data...</div>;
  }

  if (isError || !parcel) {
    return <div className="rounded-2xl bg-white p-8 text-sm text-red-500 shadow-sm">Parcel not found.</div>;
  }

  const normalized = currentStatus;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Parcel</h1>
            <p className="mt-1 text-gray-600">Parcel ID: {String(parcel._id).slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/parcels/${parcel._id}`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              View
            </Link>
            <button onClick={() => navigate("/dashboard/parcels")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">Parcel Details</h2>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${currentPaymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {currentPaymentStatus}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
            <p><span className="font-semibold">Client:</span> {parcel.senderName || parcel.senderEmail}</p>
            <p><span className="font-semibold">Receiver:</span> {parcel.receiverName || "N/A"}</p>
            <p><span className="font-semibold">Route:</span> {parcel.senderDistrict || "-"} {"->"} {parcel.receiverDistrict || "-"}</p>
            <p><span className="font-semibold">Weight:</span> {parcel.parcelWeight} KG</p>
            <p><span className="font-semibold">Tracking No:</span> {parcel.trackingNo || "Not generated"}</p>
            <p><span className="font-semibold">Payment:</span> {currentPaymentStatus}</p>
            <p><span className="font-semibold">Current Status:</span> {normalized}</p>
            <p><span className="font-semibold">Pickup Rider:</span> {parcel.pickupRiderName || parcel.pickupRiderEmail || "Not assigned"}</p>
            <p><span className="font-semibold">Delivery Rider:</span> {parcel.deliveryRiderName || parcel.deliveryRiderEmail || "Not assigned"}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Payment", value: currentPaymentStatus, tone: currentPaymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700" },
              { label: "Parcel Status", value: normalized, tone: "bg-[#f7f7f7] text-gray-700" },
              { label: "Assignment", value: parcel.pickupRiderEmail && parcel.deliveryRiderEmail ? "Assigned" : "Pending", tone: parcel.pickupRiderEmail && parcel.deliveryRiderEmail ? "bg-[#eef6d6] text-[#6e8f17]" : "bg-[#fff0f0] text-[#c15b5b]" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border border-gray-100 p-3 ${item.tone}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{item.label}</p>
                <p className="mt-1 text-sm font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">Actions</h2>
            <span className="text-xs text-gray-500">Admin only</span>
          </div>

          {renderStepCard()}

          <ol className="mt-4 list-decimal space-y-1 pl-5 text-xs text-gray-500">
            <li>Assign pickup rider when status is paid.</li>
            <li>Rider confirms pickup and status moves to in-transit or ready-for-delivery.</li>
            {!sameRoute ? <li>Confirm reached service center then ship parcel.</li> : null}
            {!sameRoute ? <li>Assign delivery rider after shipped.</li> : null}
            <li>Delivery rider confirms delivery at the end.</li>
          </ol>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Timeline</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {timelineOrder.map((item) => {
            const active = timelineOrder.indexOf(item) <= timelineOrder.indexOf(normalized);
            return (
              <div key={item} className={`rounded-lg border px-3 py-3 text-center text-xs font-semibold ${active ? "border-[#caeb66] bg-[#f3f9dd] text-[#1f1f1f]" : "border-gray-200 bg-white text-gray-400"}`}>
                {item}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-700">Workflow audit log</h3>
            <button
              onClick={() => {
                setActionFilter("all");
                setUserFilter("all");
                setDateFrom("");
                setDateTo("");
              }}
              className="rounded-md border border-gray-300 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-100"
            >
              Reset filters
            </button>
          </div>

          <div className="mb-3 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)]">
              <option value="all">All actions</option>
              {auditActions.map((status) => (
                <option key={status} value={status}>{status.replace(/-/g, " ")}</option>
              ))}
            </select>

            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)]">
              <option value="all">All users</option>
              {auditUsers.map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)]" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-md border border-gray-300 px-2 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)]" />
          </div>

          <div className="space-y-2">
            {filteredTimelineEvents.length === 0 ? (
              <p className="text-xs text-gray-500">No tracking logs yet.</p>
            ) : (
              filteredTimelineEvents.map((event) => (
                <div key={event._id} className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs">
                  <p className="font-semibold text-gray-700">{String(event.status || "pending").replace(/-/g, " ")}</p>
                  <p className="text-gray-500">{event.message}</p>
                  <p className="text-[11px] text-gray-500">By: {event.actorEmail || "system@zapshift.local"}</p>
                  <p className="text-[11px] text-gray-400">{event.createdAt ? new Date(event.createdAt).toLocaleString() : "-"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageParcel;
