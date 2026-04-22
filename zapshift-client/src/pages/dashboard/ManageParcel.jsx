import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useParcelById from "../../hooks/useParcelById";
import axiosSecure from "../../hooks/useAxiosSecure";
import { MdOutlineTimeline, MdManageAccounts, MdInfo, MdHistory, MdFilterList, MdArrowBack, MdVisibility } from "react-icons/md";

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
      await axiosSecure.patch(`/parcels/${parcel._id}/workflow`, { action, riderEmail });
      await Swal.fire({ icon: "success", title: "Workflow updated", text: "Parcel delivery step updated successfully.", confirmButtonColor: "#b8d94a" });
      await Promise.all([refetch(), refetchTracking()]);
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Action failed", text: error?.response?.data?.message || "Could not process action.", confirmButtonColor: "#ef4444" });
    } finally {
      setSaving(false);
    }
  };

  const promptAssignRider = async (actionType) => {
    if (!canManage) {
      await Swal.fire({ icon: "warning", title: "Payment required", text: "Only paid parcels can be managed.", confirmButtonColor: "#f59e0b" });
      return;
    }
    if (!approvedRiders.length) {
      await Swal.fire({ icon: "warning", title: "No rider available", text: "No approved rider found right now.", confirmButtonColor: "#f59e0b" });
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
      confirmButtonColor: "#b8d94a",
      inputValidator: (value) => (!value ? `Please choose a ${label} rider` : undefined),
    });
    if (!pick.isConfirmed || !pick.value) return;
    await runWorkflowAction(actionType, pick.value);
  };

  const confirmSimpleAction = async (actionType, title, text) => {
    const result = await Swal.fire({ icon: "question", title, text, showCancelButton: true, confirmButtonText: "Continue", confirmButtonColor: "#b8d94a" });
    if (!result.isConfirmed) return;
    await runWorkflowAction(actionType);
  };

  const renderStepCard = () => {
    const baseCard = "rounded-2xl border p-5 shadow-sm";
    if (currentPaymentStatus !== "paid") return <div className={`${baseCard} border-rose-100 bg-rose-50 text-rose-700 font-bold text-sm`}>Parcel is unpaid. Manage actions are disabled.</div>;
    
    if (currentStatus === "paid") {
      return (
        <div className={`${baseCard} border-lime-100 bg-lime-50`}>
          <p className="text-sm font-black text-[#1c2d1a]">1. Assign Pickup Rider</p>
          <p className="mt-1 text-xs text-[#1c2d1a]/70">Assign an approved rider to collect this parcel.</p>
          <button disabled={saving || ridersLoading} onClick={() => promptAssignRider("assign-pickup")} className="mt-4 w-full sm:w-auto rounded-xl bg-[#b8d94a] px-6 py-2.5 text-sm font-black text-[#1c2d1a] shadow-sm transition hover:brightness-95 active:scale-95">Assign Now</button>
        </div>
      );
    }
    if (currentStatus === "ready-to-pickup") return <div className={`${baseCard} border-amber-100 bg-amber-50 text-amber-700 text-sm font-bold`}>Waiting for rider pickup confirmation...</div>;
    
    if (!sameRoute && currentStatus === "in-transit") {
      return (
        <div className={`${baseCard} border-blue-100 bg-blue-50`}>
          <p className="text-sm font-black text-blue-800">3. Confirm Receipt</p>
          <p className="mt-1 text-xs text-blue-700/70">Confirm parcel reached destination service center.</p>
          <button disabled={saving} onClick={() => confirmSimpleAction("confirm-received", "Confirm Receipt?", "Status will move to 'Reached Service Center'.")} className="mt-4 w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-110 active:scale-95">Confirm Received</button>
        </div>
      );
    }
    if (!sameRoute && currentStatus === "reached-service-center") {
      return (
        <div className={`${baseCard} border-indigo-100 bg-indigo-50`}>
          <p className="text-sm font-black text-indigo-800">4. Dispatch for Delivery</p>
          <p className="mt-1 text-xs text-indigo-700/70">Dispatch from hub for final delivery allocation.</p>
          <button disabled={saving} onClick={() => confirmSimpleAction("ship-parcel", "Ship Parcel?", "Status will move to 'Shipped'.")} className="mt-4 w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-110 active:scale-95">Ship Parcel</button>
        </div>
      );
    }
    if ((!sameRoute && currentStatus === "shipped") || (sameRoute && currentStatus === "in-transit")) {
      return (
        <div className={`${baseCard} border-orange-100 bg-orange-50`}>
          <p className="text-sm font-black text-orange-800">5. Assign Delivery Rider</p>
          <p className="mt-1 text-xs text-orange-700/70">Assign a rider for the last-mile delivery.</p>
          <button disabled={saving || ridersLoading} onClick={() => promptAssignRider("assign-delivery")} className="mt-4 w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-110 active:scale-95">Assign Delivery Rider</button>
        </div>
      );
    }
    if (currentStatus === "ready-for-delivery") return <div className={`${baseCard} border-emerald-100 bg-emerald-50 text-emerald-700 text-sm font-bold`}>Out for delivery. Waiting for rider confirmation...</div>;
    if (currentStatus === "delivered") return <div className={`${baseCard} border-green-100 bg-green-50 text-green-700 text-sm font-bold`}>Parcel delivered successfully!</div>;
    return <div className={`${baseCard} border-gray-100 bg-gray-50 text-gray-600 font-bold text-sm`}>Current status: {currentStatus.replace(/-/g, " ")}</div>;
  };

  if (isLoading) return <div className="rounded-3xl bg-white p-12 text-center text-gray-500 shadow-sm animate-pulse">Loading secure parcel data...</div>;
  if (isError || !parcel) return <div className="rounded-3xl bg-white p-12 text-center text-red-500 shadow-sm">Parcel not found or access denied.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Manage Parcel</h1>
          <p className="mt-1 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">ID: #{String(parcel._id).slice(-10).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/dashboard/parcels/${parcel._id}`)} className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 shadow-sm transition hover:bg-gray-50 flex items-center gap-1.5"><MdVisibility /> View</button>
          <button onClick={() => navigate(-1)} className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 shadow-sm transition hover:bg-gray-50 flex items-center gap-1.5"><MdArrowBack /> Back</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Info Column */}
        <section className="space-y-6">
           <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#103d45]"><MdInfo className="text-[#b8d94a]"/> Parcel Details</h2>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${currentPaymentStatus === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{currentPaymentStatus}</span>
              </div>
              
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sender</p>
                    <p className="text-sm font-bold text-[#103d45]">{parcel.senderName}</p>
                    <p className="text-xs text-gray-500">{parcel.senderEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Receiver</p>
                    <p className="text-sm font-bold text-[#103d45]">{parcel.receiverName}</p>
                    <p className="text-xs text-gray-500">{parcel.receiverPhone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Route & Logistics</p>
                    <p className="text-sm font-bold text-[#103d45]">{parcel.senderDistrict} → {parcel.receiverDistrict}</p>
                    <p className="text-xs text-gray-500">{parcel.parcelWeight} kg | {parcel.parcelType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tracking Info</p>
                    <p className="text-sm font-black text-[#b8d94a]">{parcel.trackingNo || "PENDING"}</p>
                    <p className="text-xs text-gray-500">Amount: Tk {parcel.amount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup Rider</p>
                  <p className="text-xs font-bold text-[#103d45] mt-1 truncate">{parcel.pickupRiderName || "Not assigned"}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Rider</p>
                  <p className="text-xs font-bold text-[#103d45] mt-1 truncate">{parcel.deliveryRiderName || "Not assigned"}</p>
                </div>
              </div>
           </div>

           <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#103d45]"><MdOutlineTimeline className="text-[#b8d94a]"/> Visual Timeline</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {timelineOrder.map((item) => {
                  const active = timelineOrder.indexOf(item) <= timelineOrder.indexOf(currentStatus);
                  return (
                    <div key={item} className={`rounded-xl border px-4 py-3 text-center text-[10px] font-black uppercase tracking-wider transition-all ${active ? "border-[#b8d94a] bg-[#faffed] text-[#1c2d1a] shadow-sm" : "border-gray-100 bg-white text-gray-300"}`}>
                      {item.replace(/-/g, " ")}
                    </div>
                  );
                })}
              </div>
           </div>
        </section>

        {/* Action Column */}
        <section className="space-y-6">
           <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#103d45]"><MdManageAccounts className="text-[#b8d94a]"/> Workflow Action</h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Engine</span>
              </div>
              {renderStepCard()}
              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Admin Instructions</p>
                <ul className="space-y-2 text-[11px] font-medium text-gray-500">
                  <li className="flex gap-2"><span>•</span> Assign pickup rider when parcel is paid.</li>
                  <li className="flex gap-2"><span>•</span> Hub confirmation needed for cross-district parcels.</li>
                  <li className="flex gap-2"><span>•</span> Last-mile delivery requires rider assignment.</li>
                </ul>
              </div>
           </div>

           {/* Audit Log */}
           <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#103d45]"><MdHistory className="text-[#b8d94a]"/> Audit Log</h2>
                <button onClick={() => { setActionFilter("all"); setUserFilter("all"); setDateFrom(""); setDateTo(""); }} className="text-[10px] font-bold text-[#b8d94a] uppercase tracking-widest hover:underline">Reset</button>
              </div>

              <div className="mb-6 grid gap-2 sm:grid-cols-2">
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-[10px] font-bold text-gray-600 outline-none focus:border-[#b8d94a]">
                  <option value="all">All Actions</option>
                  {auditActions.map(s => <option key={s} value={s}>{s.replace(/-/g, " ")}</option>)}
                </select>
                <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-[10px] font-bold text-gray-600 outline-none focus:border-[#b8d94a]">
                  <option value="all">All Users</option>
                  {auditUsers.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {filteredTimelineEvents.length === 0 ? (
                  <p className="py-12 text-center text-xs text-gray-400 font-medium italic">No tracking history found.</p>
                ) : (
                  filteredTimelineEvents.map((event) => (
                    <div key={event._id} className="relative pl-5 border-l-2 border-gray-100">
                      <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-gray-200" />
                      <p className="text-xs font-black text-[#103d45] uppercase tracking-tight">{String(event.status || "").replace(/-/g, " ")}</p>
                      <p className="mt-1 text-[11px] text-gray-500 leading-relaxed">{event.message}</p>
                      <div className="mt-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        <span>{event.actorEmail || "system"}</span>
                        <span>{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default ManageParcel;
