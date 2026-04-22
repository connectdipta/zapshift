import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import axiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { MdWallet, MdLocalShipping, MdInventory2, MdCheckCircle, MdArrowForward, MdFlashOn } from "react-icons/md";

const RiderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: riderProfile } = useQuery({
    queryKey: ["rider-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/me?email=${encodeURIComponent(user.email)}`);
      return res.data || {};
    },
  });

  const { data: parcels = [] } = useQuery({
    queryKey: ["rider-dashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data || [];
    },
  });

  const pickupCount = parcels.filter((p) => String(p.status || "").toLowerCase() === "ready-to-pickup").length;
  const toDeliverCount = parcels.filter((p) => String(p.status || "").toLowerCase() === "ready-for-delivery").length;
  const deliveredCount = parcels.filter((p) => String(p.status || "").toLowerCase() === "delivered").length;
  const earnings = Number(riderProfile?.earnings || 0);

  const todaysTasks = parcels
    .filter((p) => {
      if (!p.createdAt) return false;
      const status = String(p.status || "").toLowerCase();
      if (!["ready-to-pickup", "ready-for-delivery"].includes(status)) return false;
      const d = new Date(p.createdAt);
      const n = new Date();
      return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
    })
    .slice(0, 5);

  const statCards = [
    { title: "Total Earnings", value: `Tk ${earnings}`, icon: MdWallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending Pickups", value: pickupCount, icon: MdInventory2, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "To Deliver", value: toDeliverCount, icon: MdLocalShipping, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Completed", value: deliveredCount, icon: MdCheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Rider Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Live performance and task management.</p>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="text-2xl" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.title}</p>
            <p className="mt-1 text-2xl font-black text-[#103d45]">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#103d45]">Today's Tasks</h2>
            <Link to="/dashboard/rider/deliveries" className="text-xs font-bold text-[#b8d94a] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {todaysTasks.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-gray-400">No new tasks for today.</p>
                <button onClick={() => navigate('/dashboard/rider/pickups')} className="mt-2 text-xs font-bold text-[#b8d94a] hover:underline">Check pickup pool</button>
              </div>
            ) : (
              todaysTasks.map((p) => (
                <div key={p._id} className="group flex items-center justify-between rounded-2xl border border-gray-50 bg-gray-50/30 p-4 transition hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#b8d94a]" />
                    <div>
                      <p className="text-xs font-bold text-[#103d45]">#{String(p._id).slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] font-medium text-gray-400">{p.senderDistrict} → {p.receiverDistrict}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase text-gray-500 shadow-sm">
                    {String(p.status || "").toLowerCase().replace(/-/g, " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#103d45]">Quick Actions</h2>
            <MdFlashOn className="text-[#b8d94a] text-xl" />
          </div>
          <div className="grid gap-3">
            <button 
              onClick={() => navigate("/dashboard/rider/pickups")}
              className="flex items-center justify-between rounded-2xl bg-[#caeb66] p-4 text-left transition hover:brightness-95 active:scale-95 shadow-sm shadow-lime-100"
            >
              <div>
                <p className="text-sm font-black text-[#1c2d1a]">Available Pickups</p>
                <p className="text-[10px] font-bold text-[#1c2d1a]/60">Scan new orders in your area</p>
              </div>
              <MdArrowForward className="text-xl text-[#1c2d1a]" />
            </button>
            
            <button 
              onClick={() => navigate("/dashboard/rider/deliveries")}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 text-left transition hover:bg-gray-50 active:scale-95"
            >
              <div>
                <p className="text-sm font-black text-[#103d45]">In Transit</p>
                <p className="text-[10px] font-bold text-gray-400">Manage parcels you've picked up</p>
              </div>
              <MdArrowForward className="text-xl text-gray-300" />
            </button>

            <button 
              onClick={() => navigate("/dashboard/rider/history")}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 text-left transition hover:bg-gray-50 active:scale-95"
            >
              <div>
                <p className="text-sm font-black text-[#103d45]">Delivery History</p>
                <p className="text-[10px] font-bold text-gray-400">View your lifetime performance</p>
              </div>
              <MdArrowForward className="text-xl text-gray-300" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RiderDashboard;
