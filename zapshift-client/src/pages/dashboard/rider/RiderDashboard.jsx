import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const RiderDashboard = () => {
  const { user } = useAuth();

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

  const pickup = parcels.filter((p) => String(p.status || "").toLowerCase() === "ready-to-pickup").length;
  const toDeliver = parcels.filter((p) => String(p.status || "").toLowerCase() === "ready-for-delivery").length;
  const delivered = parcels.filter((p) => String(p.status || "").toLowerCase() === "delivered").length;

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

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Rider Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Live summary of pickup and delivery performance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4"><p className="text-xs text-gray-500">Earning</p><p className="mt-1 text-3xl font-bold text-[#1f1f1f]">Tk {earnings}</p></div>
        <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4"><p className="text-xs text-gray-500">Parcel to PickUp</p><p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{pickup}</p></div>
        <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4"><p className="text-xs text-gray-500">Parcel to Deliver</p><p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{toDeliver}</p></div>
        <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4"><p className="text-xs text-gray-500">Delivered</p><p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{delivered}</p></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Today Tasks</h2>
            <Link to="/dashboard/rider/deliveries" className="text-xs font-semibold text-[#6e8d1f]">View All</Link>
          </div>
          <div className="space-y-2">
            {todaysTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No new tasks for today.</p>
            ) : (
              todaysTasks.map((p) => (
                <div key={p._id} className="rounded-lg border border-gray-200 bg-[#fafafa] px-3 py-2">
                  <p className="text-sm font-semibold text-gray-800">#{String(p._id).slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{p.senderDistrict || "-"} {"->"} {p.receiverDistrict || "-"}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-gray-900">Quick Actions</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to="/dashboard/rider/pickups" className="rounded-lg bg-[#caeb66] px-4 py-3 text-sm font-semibold text-[#111]">Pickup Tasks</Link>
            <Link to="/dashboard/rider/deliveries" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">In Transit</Link>
            <Link to="/dashboard/rider/history" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">Delivery History</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
