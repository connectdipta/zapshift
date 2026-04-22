import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import { MdPayments, MdSearch, MdRefresh, MdOutlineReceipt, MdAccountBalanceWallet } from "react-icons/md";

const PaymentHistory = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/admin/payments");
      return res.data || { totalIncome: 0, transactions: [] };
    },
  });

  const transactions = data?.transactions || [];

  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) => {
      const parcelId = String(t.parcelId || "").toLowerCase();
      const transactionId = String(t.transactionId || "").toLowerCase();
      const clientName = String(t.clientName || "").toLowerCase();
      const status = String(t.status || "").toLowerCase();
      return parcelId.includes(q) || transactionId.includes(q) || clientName.includes(q) || status.includes(q);
    });
  }, [search, transactions]);

  const totalIncome = Number(data?.totalIncome || 0);
  const formatDate = (val) => val ? new Date(val).toLocaleDateString() : "-";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Financial Records</h1>
          <p className="mt-1 text-sm text-gray-500">Global transaction history and revenue tracking.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#b8d94a] px-5 py-3 rounded-2xl shadow-sm shadow-lime-100">
           <MdAccountBalanceWallet className="text-[#103d45] text-xl" />
           <span className="text-lg font-black text-[#103d45]">Tk {totalIncome.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
         {[
           { label: "Total Revenue", value: `Tk ${totalIncome.toFixed(2)}`, color: "text-[#103d45]" },
           { label: "Total Transactions", value: transactions.length, color: "text-[#103d45]" },
           { label: "Filtered Records", value: filteredTransactions.length, color: "text-[#103d45]" },
         ].map((stat, idx) => (
           <div key={idx} className={`rounded-3xl border border-gray-100 bg-white p-6 shadow-sm ${idx === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
             <p className={`mt-1 text-2xl font-black ${stat.color}`}>{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions, clients, or status..."
            className="w-full rounded-2xl border border-gray-100 bg-white px-12 py-3.5 text-sm outline-none transition focus:border-[#b8d94a] focus:ring-4 focus:ring-lime-50"
          />
        </div>
        <button onClick={() => refetch()} className="rounded-2xl bg-white border border-gray-100 px-6 py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-2"><MdRefresh className="text-xl"/> Refresh</button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">ID & Date</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Transaction Details</th>
              <th className="px-6 py-4 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={4} className="py-20 text-center text-gray-400 text-sm">Accessing ledgers...</td></tr>
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-gray-400 text-sm">No transaction records found.</td></tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={String(t.parcelId)} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-[#103d45]">#{String(t.parcelId).slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] font-medium text-gray-400">{formatDate(t.paidAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{t.clientName || "Anonymous"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.transactionId}</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600 border border-emerald-100">{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-[#103d45]">Tk {(Number(t.amount) || 0).toFixed(2)}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {filteredTransactions.map((t) => (
          <div key={String(t.parcelId)} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#b8d94a]"><MdOutlineReceipt /></div>
                   <p className="font-mono text-[10px] font-black text-gray-400">#{String(t.parcelId).slice(-8).toUpperCase()}</p>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t.status}</span>
             </div>
             
             <div className="border-y border-gray-50 py-3 space-y-1">
                <p className="text-base font-extrabold text-[#103d45]">{t.clientName || "Anonymous"}</p>
                <p className="text-[10px] font-bold text-gray-400 truncate">{t.transactionId}</p>
             </div>

             <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(t.paidAt)}</span>
                <span className="text-base font-black text-[#103d45]">Tk {(Number(t.amount) || 0).toFixed(2)}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
