import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useParcelById from "../../hooks/useParcelById";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/useAxiosSecure";
import { MdPayment, MdOutlineSecurity, MdOutlineReceiptLong, MdArrowBack } from "react-icons/md";

const PayParcel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: parcel, isLoading, isError } = useParcelById(id);
  const [processing, setProcessing] = useState(false);

  const cardData = {
    holder: user?.displayName || "CARDHOLDER",
    number: "5432 1234 5678 9012",
    expiry: "12/27",
    bank: "ZapShift Reserve"
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const transactionId = `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
      const paymentRes = await axiosSecure.patch(`/parcels/${id}/pay`, { transactionId });
      const responseData = paymentRes?.data || {};
      const paidTransactionId = responseData.transactionId || transactionId;
      const trackingNo = responseData.trackingNo || "N/A";

      await Swal.fire({
        icon: "success",
        title: "Payment Successful",
        html: `
          <div style="text-align:left;line-height:1.6;font-size:14px;color:#103d45;">
            <p><strong>Tracking No:</strong> ${trackingNo}</p>
            <p><strong>Transaction:</strong> ${paidTransactionId}</p>
          </div>
        `,
        confirmButtonColor: "#b8d94a",
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["parcels", user?.email] }),
        queryClient.invalidateQueries({ queryKey: ["admin-overview-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-notification-parcels", user?.email] }),
      ]);
      navigate("/dashboard/user/invoices");
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Payment Failed", text: error?.response?.data?.message || "Payment processing error.", confirmButtonColor: "#ef4444" });
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <div className="rounded-3xl bg-white p-12 text-center text-gray-400 shadow-sm animate-pulse">Loading secure checkout...</div>;
  if (isError || !parcel) return <div className="rounded-3xl bg-white p-12 text-center text-rose-500 shadow-sm font-bold">Parcel initialization failed.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Complete Payment</h1>
          <p className="mt-1 text-sm text-gray-500">Secure transaction for parcel ID: #{String(id).slice(-8).toUpperCase()}</p>
        </div>
        <button onClick={() => navigate(-1)} className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition flex items-center gap-2"><MdArrowBack /> Back</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Summary */}
        <div className="space-y-6">
           <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-[#103d45] flex items-center gap-2 mb-6"><MdOutlineReceiptLong className="text-[#b8d94a]"/> Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-3">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Service Fee</span>
                   <span className="text-sm font-bold text-[#103d45]">Tk {parcel.amount}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-3">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight ({parcel.parcelWeight}kg)</span>
                   <span className="text-sm font-bold text-gray-400">Included</span>
                </div>
                <div className="flex justify-between pt-2">
                   <span className="text-sm font-black text-[#103d45] uppercase tracking-widest">Total Payable</span>
                   <span className="text-2xl font-black text-[#b8d94a]">Tk {parcel.amount}</span>
                </div>
              </div>
           </div>

           <div className="rounded-3xl bg-[#103d45] p-6 shadow-sm sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><MdOutlineSecurity className="text-8xl" /></div>
              <h3 className="text-lg font-bold mb-2">Secure Checkout</h3>
              <p className="text-xs text-white/60 leading-relaxed">Your transaction is protected by 256-bit SSL encryption. ZapShift does not store full card details on its servers.</p>
           </div>
        </div>

        {/* Right: Payment Method */}
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-gray-100 space-y-8">
           <h2 className="text-xl font-bold text-[#103d45] flex items-center gap-2"><MdPayment className="text-[#b8d94a]"/> Payment Method</h2>
           
           {/* Visual Card */}
           <div className="relative w-full aspect-[1.6/1] rounded-3xl shadow-xl overflow-hidden scale-100 sm:scale-105 origin-center transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-[#103d45] via-[#1a4f59] to-[#0a292e]" />
              <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between text-white">
                 <div className="flex justify-between items-start">
                    <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner" />
                    <span className="text-xl font-black italic tracking-tighter opacity-50 uppercase">{cardData.bank}</span>
                 </div>
                 
                 <div className="space-y-6">
                    <p className="text-lg sm:text-2xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em]">{cardData.number}</p>
                    <div className="flex gap-8">
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Holder</p>
                          <p className="text-xs sm:text-sm font-bold uppercase">{cardData.holder}</p>
                       </div>
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Expires</p>
                          <p className="text-xs sm:text-sm font-bold font-mono">{cardData.expiry}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4 pt-4">
              <button
                onClick={handlePayment}
                disabled={processing || parcel.paymentStatus === "paid"}
                className="w-full rounded-2xl bg-[#caeb66] py-4 text-base font-black text-[#1c2d1a] shadow-lg shadow-lime-100 transition hover:brightness-95 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              >
                {parcel.paymentStatus === "paid" ? "✓ Already Completed" : processing ? "Processing Payment..." : `Confirm & Pay Tk ${parcel.amount}`}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full rounded-2xl border border-gray-100 bg-white py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 transition"
              >
                Cancel & Return
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PayParcel;
