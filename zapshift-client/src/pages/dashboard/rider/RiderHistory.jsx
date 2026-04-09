import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";

const RiderHistory = () => {
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["rider-history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return (res.data || []).filter((p) => ["delivered", "shipped"].includes(String(p.status || "").toLowerCase()));
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
        <p className="mt-2 text-gray-600">Completed and shipped parcel records.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-3 py-2">Parcel ID</th>
              <th className="px-3 py-2">Receiver</th>
              <th className="px-3 py-2">Route</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">Loading history...</td></tr>
            ) : parcels.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">No history yet.</td></tr>
            ) : (
              parcels.map((p) => (
                <tr key={p._id} className="border-b border-gray-100">
                  <td className="px-3 py-2">{String(p._id).slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-2">{p.receiverName || "N/A"}</td>
                  <td className="px-3 py-2">{p.senderDistrict || "-"} {"->"} {p.receiverDistrict || "-"}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2">Tk {Number(p.amount || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiderHistory;
