import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
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
  MdSettings,
} from "react-icons/md";
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axiosSecure from "../../hooks/useAxiosSecure";

const DashboardOverview = () => {
  const navigate = useNavigate();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/admin/stats");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const { data: parcels = [], isLoading: parcelsLoading, isError } = useQuery({
    queryKey: ["admin-overview-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data || [];
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const rowsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const shippingRows = useMemo(() => {
    return parcels
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map((p) => ({
        id: `#${String(p._id || "").slice(-6).toUpperCase()}`,
        client: p.senderName || p.senderEmail || "N/A",
        date: new Date(p.createdAt || Date.now()).toLocaleDateString(),
        weight: `${Number(p.parcelWeight) || 0} kg`,
        shipper: p.parcelType === "document" ? "Document" : "Parcel",
        price: `${(Number(p.amount) || 0).toFixed(2)}`,
        status: String(p.status || "pending").toLowerCase(),
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
    paid: "bg-emerald-100 text-emerald-700",
    shipped: "bg-cyan-100 text-cyan-700",
    failed: "bg-rose-100 text-rose-700",
    damaged: "bg-orange-100 text-orange-700",
  };

  const totals = statsData?.totals || { newPackages: 0, readyForShipping: 0, completed: 0, newClients: 0 };
  const stats = [
    { title: "New Packages", value: totals.newPackages, color: "text-blue-600" },
    { title: "Ready for Shipping", value: totals.readyForShipping, color: "text-amber-600" },
    { title: "Completed", value: totals.completed, color: "text-green-600" },
    { title: "New Clients", value: totals.newClients, color: "text-purple-600" },
  ];

  const alerts = statsData?.alerts || { delayed: 0, failed: 0, damaged: 0 };
  const chartData = useMemo(() => {
    const source = Array.isArray(statsData?.chart) ? statsData.chart : [];
    const fallbackDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (!source.length) return fallbackDays.map((day) => ({ day, parcels: 0, income: 0 }));
    return source.map((item) => ({
      day: item?.day || "",
      parcels: Number(item?.parcels) || 0,
      income: Number(item?.income) || 0,
    }));
  }, [statsData?.chart]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#103d45]">Admin Overview</h1>
          <p className="text-xs text-gray-500">Monitor system-wide parcel delivery performance.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/send-parcel")}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#caeb66] px-5 py-3 text-sm font-bold text-[#1c2d1a] transition hover:brightness-95 active:scale-95"
        >
          <MdAdd className="text-lg" />
          Create Shipment
        </button>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                <MdLocalShipping className="text-sm" />
              </span>
              {item.title}
            </div>
            <p className={`text-2xl font-black ${item.color || "text-[#103d45]"}`}>{statsLoading ? "..." : item.value.toLocaleString()}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Chart Section */}
        <section className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#103d45]">System Revenue</h2>
            <div className="flex items-center gap-2">
               <button className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600">This Week <MdKeyboardArrowDown /></button>
               <button className="rounded-xl border border-gray-100 bg-gray-50 p-2 text-gray-500"><MdMoreVert /></button>
            </div>
          </div>
          <div className="h-[260px] w-full pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`Tk ${Number(value).toFixed(2)}`, "Revenue"]} 
                />
                <Line type="monotone" dataKey="income" stroke="#b8d94a" strokeWidth={4} dot={{ r: 4, fill: "#caeb66", strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Alerts Section */}
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#103d45]">System Alerts</h2>
            <Link to="/dashboard/delivery" className="text-xs font-bold text-[#b8d94a] hover:underline">Manage All</Link>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-orange-50 p-3">
              <p className="text-lg font-black text-orange-600">{alerts.damaged}</p>
              <p className="text-[9px] font-bold uppercase text-orange-400">Damaged</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="text-lg font-black text-amber-600">{alerts.delayed}</p>
              <p className="text-[9px] font-bold uppercase text-amber-400">Delayed</p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-3">
              <p className="text-lg font-black text-rose-600">{alerts.failed}</p>
              <p className="text-[9px] font-bold uppercase text-rose-400">Failed</p>
            </div>
          </div>
          <div className="space-y-2">
            {[{ title: "Damaged Items", count: alerts.damaged, color: 'text-orange-500' }, { title: "Delayed Shipments", count: alerts.delayed, color: 'text-amber-500' }, { title: "Failed Deliveries", count: alerts.failed, color: 'text-rose-500' }].map((alert) => (
              <div key={alert.title} className="flex items-center justify-between rounded-xl border border-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 ${alert.color}`}><MdInfoOutline /></span>
                  <div>
                    <p className="text-xs font-bold text-gray-700">{alert.title}</p>
                    <p className="text-[10px] font-medium text-gray-400">{alert.count} instances</p>
                  </div>
                </div>
                <MdArrowForward className="text-gray-300" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Shipping Reports Table */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-[#103d45]">Global Shipping Reports</h2>
          <div className="flex items-center gap-2">
             <button className="rounded-xl border border-gray-100 bg-gray-50 p-2 text-gray-500"><MdFilterList /></button>
             <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 disabled:opacity-30"><MdArrowBack /></button>
                <span className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 disabled:opacity-30"><MdArrowForward /></button>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parcelsLoading ? (
                <tr><td colSpan={6} className="py-20 text-center text-gray-400 text-sm">Loading data...</td></tr>
              ) : paginatedRows.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-gray-400 text-sm">No records found</td></tr>
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
                       <div className="flex justify-end gap-1.5">
                        <button onClick={() => navigate(`/dashboard/parcels/${row.parcelId}`)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#caeb66] hover:text-[#1c2d1a] transition-all"><MdVisibility /></button>
                        <button onClick={() => navigate(`/dashboard/manage/${row.parcelId}`)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#103d45] text-white hover:brightness-125 transition-all"><MdSettings className="text-sm" /></button>
                       </div>
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

export default DashboardOverview;
