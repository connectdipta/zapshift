import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { MdHistory, MdDoneAll, MdArrowForward } from "react-icons/md";

const RiderHistory = () => {
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["rider-history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return (res.data || []).filter((p) => ["delivered", "shipped"].includes(String(p.status || "").toLowerCase()));
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Delivery History</h1>
          <p className="mt-1 text-sm text-gray-500">Record of your successfully completed and shipped tasks.</p>
        </div>
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
           <MdHistory className="text-gray-400 text-xl" />
           <span className="text-xl font-black text-[#103d45]">{parcels.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-40 animate-pulse rounded-3xl bg-gray-100" />)}
        </div>
      ) : parcels.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
            <MdHistory className="text-4xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No history found</h3>
          <p className="mt-2 text-sm text-gray-500">Completed tasks will appear here for your records.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcels.map((p) => (
            <div key={p._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{String(p._id).slice(-8).toUpperCase()}</span>
                  <h3 className="text-base font-extrabold text-[#103d45] mt-1">{p.receiverName || "N/A"}</h3>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${p.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                   {p.status === 'delivered' && <MdDoneAll className="text-xs" />}
                   {p.status}
                </div>
              </div>

              <div className="border-y border-gray-50 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Route</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <span>{p.senderDistrict}</span>
                    <MdArrowForward className="text-gray-300" />
                    <span>{p.receiverDistrict}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commission</span>
                  <span className="text-xs font-black text-[#103d45]">Tk {Number(p.amount || 0).toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[10px] font-medium text-gray-400 italic">Task logged: {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderHistory;
