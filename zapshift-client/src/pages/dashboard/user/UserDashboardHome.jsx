import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  MdLocalShipping,
  MdMoreVert,
  MdKeyboardArrowDown,
  MdFilterList,
  MdArrowForward,
  MdArrowBack,
  MdInfoOutline,
  MdAdd,
  MdVisibility,
} from "react-icons/md";
import useUserParcels from "../../../hooks/useUserParcels";

const UserDashboardHome = () => {
  const navigate = useNavigate();
  const { parcels, isLoading, isError } = useUserParcels();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const stats = [
    { title: "To Pay", value: parcels.filter((p) => p.paymentStatus !== "paid").length, color: "text-red-500" },
    { title: "Ready Pick Up", value: parcels.filter((p) => p.normalizedStatus === "ready-to-pickup").length, color: "text-amber-500" },
    { title: "In Transit", value: parcels.filter((p) => p.normalizedStatus === "in-transit").length, color: "text-blue-500" },
    { title: "Ready to Deliver", value: parcels.filter((p) => p.normalizedStatus === "ready-for-delivery").length, color: "text-orange-500" },
    { title: "Delivered", value: parcels.filter((p) => p.normalizedStatus === "delivered").length, color: "text-green-500" },
  ];

  const shippingRows = useMemo(() => {
    return parcels
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((p) => ({
        id: `#${String(p._id || "").slice(-6).toUpperCase() || "PARCEL"}`,
        client: p.receiverName || "N/A",
        date: p.createdAt.toLocaleDateString(),
        weight: `${p.parcelWeight || 0} kg`,
        shipper: p.parcelType === "document" ? "Document" : "Parcel",
        price: `${p.amount.toFixed(2)}`,
        status: p.normalizedStatus,
        parcelId: p._id,
      }));
  }, [parcels]);

  const totalPages = Math.max(1, Math.ceil(shippingRows.length / rowsPerPage));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return shippingRows.slice(start, start + rowsPerPage);
  }, [shippingRows, currentPage]);

  const statusColor = {
    delivered: "bg-green-100 text-green-700",
    "in-transit": "bg-blue-100 text-blue-700",
    waiting: "bg-red-100 text-red-700",
    pending: "bg-gray-100 text-gray-700",
    processing: "bg-indigo-100 text-indigo-700",
    "ready-to-pickup": "bg-amber-100 text-amber-700",
    "ready-for-delivery": "bg-orange-100 text-orange-700",
    "reached-service-center": "bg-sky-100 text-sky-700",
    shipped: "bg-cyan-100 text-cyan-700",
  };

  const lateInvoices = parcels.filter((p) => p.paymentStatus !== "paid").slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#103d45]">Dashboard Overview</h1>
          <p className="text-xs text-gray-500">Access your delivery data and information from anywhere.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/user/send-parcel")}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#caeb66] px-5 py-3 text-sm font-bold text-[#1c2d1a] transition hover:brightness-95 active:scale-95"
        >
          <MdAdd className="text-lg" />
          Send New Parcel
        </button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                <MdLocalShipping className="text-sm" />
              </span>
              {item.title}
            </div>
            <p className={`text-2xl font-black ${item.color || "text-[#103d45]"}`}>{item.value.toLocaleString()}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main Chart Section */}
        <section className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#103d45]">Delivery Trends</h2>
            <div className="flex items-center gap-2">
              <button className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600">
                This Week
                <MdKeyboardArrowDown className="text-sm" />
              </button>
              <button className="rounded-xl border border-gray-100 bg-gray-50 p-2 text-gray-500">
                <MdMoreVert className="text-sm" />
              </button>
            </div>
          </div>

          <div className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-gray-50/50 p-4">
            <div className="absolute inset-4 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:60px_40px]" />
            <div className="absolute inset-0 flex items-end px-12 pb-8">
               {/* Simplified responsive area chart mockup */}
               <svg viewBox="0 0 900 200" className="w-full h-full preserve-3d">
                <path d="M0,150 C100,140 150,50 300,80 C450,110 500,180 650,120 C800,60 850,20 900,50 L900,200 L0,200 Z" fill="rgba(202, 235, 102, 0.2)" />
                <path d="M0,150 C100,140 150,50 300,80 C450,110 500,180 650,120 C800,60 850,20 900,50" fill="none" stroke="#b8d94a" strokeWidth="4" strokeLinecap="round" />
               </svg>
            </div>
          </div>
        </section>

        {/* Shipment Alerts */}
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#103d45]">Shipment Alerts</h2>
            <Link to="/dashboard/user/parcels" className="text-xs font-bold text-[#b8d94a] hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {parcels.slice(0, 4).length === 0 ? (
              <p className="py-10 text-center text-xs text-gray-400 font-medium">No recent alerts</p>
            ) : (
              parcels.slice(0, 4).map((parcel) => (
                <div key={parcel._id} onClick={() => navigate(`/dashboard/user/parcels/${parcel._id}`)} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-50 p-3 transition hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${parcel.normalizedStatus === 'delivered' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                      <MdInfoOutline className="text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#103d45]">{parcel.normalizedStatus.replace(/-/g, " ").toUpperCase()}</p>
                      <p className="text-[10px] font-medium text-gray-400">#{String(parcel._id).slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <MdArrowForward className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#b8d94a]" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Reports Table Section */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-[#103d45]">Shipping Reports</h2>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-gray-100 bg-gray-50 p-2 text-gray-500">
              <MdFilterList className="text-lg" />
            </button>
            <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
               <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 disabled:opacity-30"><MdArrowBack /></button>
               <span className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentPage} / {totalPages}</span>
               <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 disabled:opacity-30"><MdArrowForward /></button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Receiver</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center text-gray-400 text-sm">Fetching reports...</td></tr>
              ) : paginatedRows.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-gray-400 text-sm">No data found</td></tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.parcelId} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-[10px] font-bold text-[#103d45]">{row.id}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{row.client}</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-gray-400">{row.date}</td>
                    <td className="px-4 py-3 text-xs font-black text-[#103d45]">Tk {row.price}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${statusColor[row.status] || statusColor.pending}`}>
                        {row.status.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => navigate(`/dashboard/user/parcels/${row.parcelId}`)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#caeb66] hover:text-[#1c2d1a] transition-all">
                        <MdVisibility />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardHome;
