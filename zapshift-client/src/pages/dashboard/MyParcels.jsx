import React from "react";
import { MdCheckCircle, MdRefresh, MdLocalShipping, MdAccessTime, MdOutlineInventory2, MdVisibility, MdManageAccounts, MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";

const MyParcels = () => {
  const navigate = useNavigate();
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["admin-shipping"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return (res.data || []).map((p) => ({
        ...p,
        normalizedStatus: String(p.status || "pending").toLowerCase(),
        paymentStatus: String(p.paymentStatus || "unpaid").toLowerCase(),
        amount: Number(p.amount) || 0,
      }));
    },
  });

  const getStatusConfig = (st) => {
    switch (st) {
      case "delivered": return { icon: MdCheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
      case "in-transit": return { icon: MdLocalShipping, color: "text-blue-600 bg-blue-50 border-blue-100" };
      case "ready-to-pickup": return { icon: MdRefresh, color: "text-orange-600 bg-orange-50 border-orange-100" };
      default: return { icon: MdAccessTime, color: "text-gray-500 bg-gray-50 border-gray-100" };
    }
  };

  const stats = {
    total: parcels.length,
    waiting: parcels.filter(p => p.normalizedStatus === "waiting").length,
    paid: parcels.filter(p => p.paymentStatus === "paid").length
  };

  const handleDelete = () => {
    Swal.fire({ title: "Access Restricted", text: "Manual deletion is disabled for system integrity.", icon: "warning", confirmButtonColor: "#103d45" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Global Shipping</h1>
          <p className="mt-1 text-sm text-gray-500">Live monitoring of all parcels currently in the ZapShift network.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#b8d94a] px-4 py-2 rounded-xl border border-lime-300">
           <MdOutlineInventory2 className="text-[#103d45]" />
           <span className="text-lg font-black text-[#103d45]">{stats.total}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-3xl bg-gray-100" />)}
        </div>
      ) : isError ? (
        <div className="rounded-3xl bg-white p-12 text-center text-rose-500 border border-rose-100 font-bold">Network synchronization failed.</div>
      ) : parcels.length === 0 ? (
        <div className="rounded-[2.5rem] bg-white p-16 text-center border border-dashed border-gray-200">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200"><MdOutlineInventory2 className="text-4xl" /></div>
          <h3 className="text-lg font-bold text-gray-800">Warehouse Empty</h3>
          <p className="mt-2 text-sm text-gray-500">No active parcel records found in the database.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
             {[
               { label: "Total Load", value: stats.total },
               { label: "On Hold", value: stats.waiting },
               { label: "Revenue Clear", value: stats.paid }
             ].map((s, idx) => (
               <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                  <p className="mt-1 text-2xl font-black text-[#103d45]">{s.value}</p>
               </div>
             ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <th className="px-6 py-4">Manifest ID</th>
                   <th className="px-6 py-4">Consignor</th>
                   <th className="px-6 py-4">Consignee</th>
                   <th className="px-6 py-4">Logistics Status</th>
                   <th className="px-6 py-4">Finance</th>
                   <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parcels.map((p) => {
                  const conf = getStatusConfig(p.normalizedStatus);
                  const Icon = conf.icon;
                  return (
                    <tr key={p._id} className="group hover:bg-gray-50/30 transition-colors">
                       <td className="px-6 py-4">
                          <p className="font-mono text-[10px] font-black text-[#103d45] uppercase tracking-widest">#{String(p._id).slice(-10).toUpperCase()}</p>
                       </td>
                       <td className="px-6 py-4 text-xs font-bold text-gray-600">{p.senderName || "System Store"}</td>
                       <td className="px-6 py-4">
                          <p className="text-xs font-black text-[#103d45]">{p.receiverName}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">{p.receiverPhone}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${conf.color}`}>
                             <Icon className="text-xs" /> {p.normalizedStatus.replace(/-/g, " ")}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-[10px] font-black text-[#103d45]">Tk {p.amount}</p>
                          <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${p.paymentStatus === "paid" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>{p.paymentStatus}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#103d45] hover:text-white transition-all shadow-sm"><MdVisibility /></button>
                             <button onClick={() => navigate(`/dashboard/manage/${p._id}`)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#b8d94a] text-[#103d45] hover:brightness-95 transition-all shadow-sm"><MdManageAccounts /></button>
                             <button onClick={handleDelete} className="h-8 w-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><MdDeleteOutline /></button>
                          </div>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {parcels.map((p) => {
              const conf = getStatusConfig(p.normalizedStatus);
              return (
                <div key={p._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                   <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] font-black text-gray-400 tracking-widest">#{String(p._id).slice(-10).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${conf.color}`}>{p.normalizedStatus}</span>
                   </div>
                   
                   <div className="space-y-3 py-2 border-y border-gray-50">
                      <div>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Recipient</p>
                         <p className="text-sm font-black text-[#103d45] mt-0.5 truncate">{p.receiverName}</p>
                      </div>
                      <div className="flex justify-between">
                         <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
                            <p className="text-xs font-black text-[#103d45]">Tk {p.amount}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payment</p>
                            <p className={`text-xs font-black uppercase ${p.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{p.paymentStatus}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500"><MdVisibility /></button>
                      <button onClick={() => navigate(`/dashboard/manage/${p._id}`)} className="h-10 rounded-xl bg-[#b8d94a] flex items-center justify-center text-[#103d45]"><MdManageAccounts /></button>
                      <button onClick={handleDelete} className="h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400"><MdDeleteOutline /></button>
                   </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyParcels;
