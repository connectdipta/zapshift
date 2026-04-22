import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import { MdOutlineLocalShipping, MdSearch, MdFilterList, MdRefresh, MdArrowForward, MdVisibility, MdManageAccounts } from "react-icons/md";

const DeliveryManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [paymentFilter, setPaymentFilter] = useState(searchParams.get("payment") || "all");

  const { data: parcels = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["delivery-management"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data || [];
    },
  });

  const stats = useMemo(() => {
    const normalized = parcels.map((parcel) => ({
      ...parcel,
      normalizedStatus: String(parcel.status || "pending").toLowerCase(),
      paymentNormalized: String(parcel.paymentStatus || "unpaid").toLowerCase(),
    }));

    return {
      total: normalized.length,
      paid: normalized.filter((parcel) => parcel.paymentNormalized === "paid").length,
      unpaid: normalized.filter((parcel) => parcel.paymentNormalized !== "paid").length,
      assigned: normalized.filter((parcel) => parcel.pickupRiderEmail && parcel.deliveryRiderEmail).length,
      ready: normalized.filter((parcel) => parcel.normalizedStatus === "ready-to-pickup").length,
      inTransit: normalized.filter((parcel) => parcel.normalizedStatus === "in-transit").length,
      delivered: normalized.filter((parcel) => parcel.normalizedStatus === "delivered").length,
    };
  }, [parcels]);

  const filtered = useMemo(() => {
    return parcels.filter((p) => {
      const id = String(p._id || "").toLowerCase();
      const tracking = String(p.trackingNo || "").toLowerCase();
      const st = String(p.status || "pending").toLowerCase();
      const payment = String(p.paymentStatus || "unpaid").toLowerCase();
      const sender = String(p.senderName || p.senderEmail || "").toLowerCase();
      const receiver = String(p.receiverName || p.receiverEmail || "").toLowerCase();
      const pickupRider = String(p.pickupRiderName || p.pickupRiderEmail || "").toLowerCase();
      const deliveryRider = String(p.deliveryRiderName || p.deliveryRiderEmail || "").toLowerCase();
      const q = search.toLowerCase();

      const matchQuery = !q || id.includes(q) || tracking.includes(q) || sender.includes(q) || receiver.includes(q) || pickupRider.includes(q) || deliveryRider.includes(q);
      const matchStatus = statusFilter === "all" || st === statusFilter || (statusFilter === "assigned" && pickupRider && deliveryRider) || (statusFilter === "unassigned" && (!pickupRider || !deliveryRider));
      const matchPayment = paymentFilter === "all" || payment === paymentFilter;
      return matchQuery && matchStatus && matchPayment;
    });
  }, [parcels, search, statusFilter, paymentFilter]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "ready-to-pickup", label: "Ready to Pickup" },
    { value: "in-transit", label: "In Transit" },
    { value: "reached-service-center", label: "Hub Reached" },
    { value: "shipped", label: "Shipped" },
    { value: "ready-for-delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "assigned", label: "Full Assigned" },
    { value: "unassigned", label: "Unassigned" },
  ];

  const paymentOptions = [
    { value: "all", label: "All Payment" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const getBadgeClass = (value, type = "status") => {
    const normalized = String(value || "").toLowerCase();
    if (type === "payment") {
      return normalized === "paid" ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    switch (normalized) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "in-transit": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-sky-100 text-sky-700 border-sky-200";
      case "ready-to-pickup": return "bg-orange-100 text-orange-700 border-orange-200";
      case "ready-for-delivery": return "bg-violet-100 text-violet-700 border-violet-200";
      case "reached-service-center": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "pending": return "bg-gray-100 text-gray-700 border-gray-200";
      case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Delivery Control</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor and manage global parcel lifecycle and assignments.</p>
        </div>
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
           <MdOutlineLocalShipping className="text-gray-400 text-xl" />
           <span className="text-xl font-black text-[#103d45]">{stats.total}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {[
          { label: "Total", value: stats.total, color: "text-[#103d45]" },
          { label: "Paid", value: stats.paid, color: "text-emerald-600" },
          { label: "Unpaid", value: stats.unpaid, color: "text-amber-600" },
          { label: "Assigned", value: stats.assigned, color: "text-blue-600" },
          { label: "Ready", value: stats.ready, color: "text-orange-600" },
          { label: "In Transit", value: stats.inTransit, color: "text-indigo-600" },
          { label: "Delivered", value: stats.delivered, color: "text-green-600" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
            <p className={`mt-1 text-2xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parcels, clients, receivers or tracking codes..."
            className="w-full rounded-2xl border border-gray-100 bg-white px-12 py-3.5 text-sm outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50 shadow-sm"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 xl:flex">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-xs font-bold text-gray-600 outline-none focus:border-[#b8d94a] shadow-sm">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-xs font-bold text-gray-600 outline-none focus:border-[#b8d94a] shadow-sm">
            {paymentOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => { setSearch(""); setStatusFilter("all"); setPaymentFilter("all"); refetch(); }} className="col-span-2 sm:col-span-1 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-3 text-xs font-bold text-gray-500 hover:bg-white hover:text-[#103d45] transition shadow-sm flex items-center justify-center gap-2"><MdRefresh className="text-lg"/> Reset</button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <th className="px-4 py-4">Parcel ID</th>
              <th className="px-4 py-4">Parties</th>
              <th className="px-4 py-4">Route</th>
              <th className="px-4 py-4">Riders</th>
              <th className="px-4 py-4">Status & Payment</th>
              <th className="px-4 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={6} className="py-20 text-center text-gray-400 text-sm">Synchronizing data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-20 text-center text-gray-400 text-sm">No parcels match these filters.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-mono text-[10px] font-black text-[#103d45] uppercase tracking-widest">#{String(p._id).slice(-10).toUpperCase()}</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">{p.trackingNo || "UN-TRACKED"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-bold text-gray-800">{p.senderName || p.senderEmail}</p>
                    <MdArrowForward className="text-gray-300 my-0.5" />
                    <p className="text-xs font-bold text-gray-800">{p.receiverName}</p>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-600">
                    {p.senderDistrict} → {p.receiverDistrict}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5"><div className={`h-1.5 w-1.5 rounded-full ${p.pickupRiderEmail ? 'bg-green-400' : 'bg-gray-200'}`} /><span className="text-[10px] font-bold text-gray-500 truncate max-w-[120px]">{p.pickupRiderName || "P: Unassigned"}</span></div>
                      <div className="flex items-center gap-1.5"><div className={`h-1.5 w-1.5 rounded-full ${p.deliveryRiderEmail ? 'bg-blue-400' : 'bg-gray-200'}`} /><span className="text-[10px] font-bold text-gray-500 truncate max-w-[120px]">{p.deliveryRiderName || "D: Unassigned"}</span></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1.5">
                       <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter w-fit ${getBadgeClass(p.paymentStatus, "payment")}`}>{p.paymentStatus}</span>
                       <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter w-fit ${getBadgeClass(p.status)}`}>{p.status.replace(/-/g, " ")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#103d45] transition-all shadow-sm"><MdVisibility /></button>
                      <button onClick={() => navigate(`/dashboard/manage/${p._id}`)} disabled={p.paymentStatus !== 'paid'} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#103d45] text-white hover:brightness-125 transition-all shadow-sm disabled:opacity-30 disabled:grayscale"><MdManageAccounts /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {filtered.map((p) => (
          <div key={p._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">#{String(p._id).slice(-10).toUpperCase()}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${getBadgeClass(p.paymentStatus, "payment")}`}>{p.paymentStatus}</span>
             </div>

             <div className="space-y-3 py-2 border-y border-gray-50">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parties</p>
                   <p className="text-xs font-bold text-gray-700 mt-0.5 truncate">{p.senderName} → {p.receiverName}</p>
                </div>
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                      <p className="text-xs font-black text-[#103d45] mt-0.5 uppercase tracking-tight">{p.status.replace(/-/g, " ")}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Route</p>
                      <p className="text-xs font-bold text-gray-600 mt-0.5">{p.senderDistrict.slice(0,3)} to {p.receiverDistrict.slice(0,3)}</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-2">
                <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="flex-1 rounded-xl bg-gray-50 border border-gray-100 py-3 text-xs font-bold text-gray-600 flex items-center justify-center gap-1.5">Details</button>
                <button onClick={() => navigate(`/dashboard/manage/${p._id}`)} disabled={p.paymentStatus !== 'paid'} className="flex-1 rounded-xl bg-[#103d45] py-3 text-xs font-black text-white shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:grayscale">Manage</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryManagement;
