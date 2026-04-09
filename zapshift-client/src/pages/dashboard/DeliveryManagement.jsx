import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";

const DeliveryManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

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
      const tracking = String(p.trackingNumber || "").toLowerCase();
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
    { value: "reached-service-center", label: "Reached Service Center" },
    { value: "shipped", label: "Shipped" },
    { value: "ready-for-delivery", label: "Ready for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "assigned", label: "Assigned" },
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
      return normalized === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";
    }

    switch (normalized) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in-transit":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-sky-100 text-sky-700";
      case "ready-to-pickup":
        return "bg-orange-100 text-orange-700";
      case "ready-for-delivery":
        return "bg-violet-100 text-violet-700";
      case "reached-service-center":
        return "bg-indigo-100 text-indigo-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "paid":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
        <p className="mt-2 text-gray-600">Search parcels, filter by status or payment, and review rider assignments.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        {[
          { label: "Total", value: stats.total },
          { label: "Paid", value: stats.paid },
          { label: "Unpaid", value: stats.unpaid },
          { label: "Assigned", value: stats.assigned },
          { label: "Ready", value: stats.ready },
          { label: "In Transit", value: stats.inTransit },
          { label: "Delivered", value: stats.delivered },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#1f1f1f]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm xl:grid-cols-[1.3fr_1fr_1fr_auto]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search parcel, client, receiver, rider or tracking"
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
        >
          {paymentOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setPaymentFilter("all");
            refetch();
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-3 py-2">Parcel ID</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Route</th>
              <th className="px-3 py-2">Assigned Riders</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-500">Loading deliveries...</td></tr>
            ) : isError ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-red-500">Unable to load delivery records.</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-500">No deliveries found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="border-b border-gray-100">
                  <td className="px-3 py-2">{String(p._id).slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-2">{p.senderName || p.senderEmail}</td>
                  <td className="px-3 py-2">{p.senderDistrict || "-"} {"->"} {p.receiverDistrict || "-"}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    <div>{p.pickupRiderName || p.pickupRiderEmail || "Pickup not assigned"}</div>
                    <div>{p.deliveryRiderName || p.deliveryRiderEmail || "Delivery not assigned"}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getBadgeClass(p.paymentStatus, "payment")}`}>
                      {String(p.paymentStatus || "unpaid").toLowerCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getBadgeClass(p.status)}`}>
                      {String(p.status || "pending").toLowerCase().replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">View</button>
                      <button
                        onClick={() => navigate(`/dashboard/manage/${p._id}`)}
                        disabled={String(p.paymentStatus || "unpaid").toLowerCase() !== "paid"}
                        className="rounded-md bg-[#caeb66] px-3 py-1 text-xs font-semibold text-[#111] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryManagement;
