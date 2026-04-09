import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";

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

    return transactions.filter((transaction) => {
      const parcelId = String(transaction.parcelId || "").toLowerCase();
      const transactionId = String(transaction.transactionId || "").toLowerCase();
      const clientName = String(transaction.clientName || "").toLowerCase();
      const status = String(transaction.status || "").toLowerCase();
      return parcelId.includes(q) || transactionId.includes(q) || clientName.includes(q) || status.includes(q);
    });
  }, [search, transactions]);

  const totalIncome = Number(data?.totalIncome || 0);

  const formatDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-2 text-gray-600">Track all transactions and total income.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="mt-1 text-4xl font-bold text-[#1f1f1f]">Tk {totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Paid Transactions</p>
          <p className="mt-1 text-4xl font-bold text-[#1f1f1f]">{transactions.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Visible Records</p>
          <p className="mt-1 text-4xl font-bold text-[#1f1f1f]">{filteredTransactions.length}</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by transaction, parcel, client, or status"
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--color-primary)] focus:outline-none"
        />
        <button onClick={() => refetch()} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-3 py-2">Transaction ID</th>
              <th className="px-3 py-2">Parcel ID</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Loading transactions...</td></tr>
            ) : isError ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-red-500">Unable to load payment history.</td></tr>
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No paid transactions yet.</td></tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={String(t.parcelId)} className="border-b border-gray-100">
                  <td className="px-3 py-2">{t.transactionId}</td>
                  <td className="px-3 py-2">{String(t.parcelId).slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-2">{t.clientName}</td>
                  <td className="px-3 py-2">Tk {(Number(t.amount) || 0).toFixed(2)}</td>
                  <td className="px-3 py-2">{formatDate(t.paidAt)}</td>
                  <td className="px-3 py-2">{t.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
