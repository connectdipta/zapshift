import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useParcelById from "../../hooks/useParcelById";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/useAxiosSecure";

const PayParcel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: parcel, isLoading, isError } = useParcelById(id);
  const [processing, setProcessing] = useState(false);

  // Mock card data
  const cardData = {
    holder: user?.displayName || "CARDHOLDER",
    number: "5432 1234 5678 9012",
    expiry: "12/27",
    cvc: "***",
    bank: "ZapShift Bank"
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const transactionId = `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
      const paymentRes = await axiosSecure.patch(`/parcels/${id}/pay`, {
        transactionId,
      });

      const responseData = paymentRes?.data || {};
      const paidTransactionId = responseData.transactionId || `TXN${Date.now()}`;
      const trackingNo = responseData.trackingNo || "N/A";

      await Swal.fire({
        icon: "success",
        title: "Payment Successful",
        html: `
          <div style="text-align:left;line-height:1.6;">
            <p><strong>Tracking No:</strong> ${trackingNo}</p>
            <p><strong>Transaction:</strong> ${paidTransactionId}</p>
            <p style="margin-top:8px;color:#4b5563;">Your payment info and tracking timeline were saved successfully.</p>
          </div>
        `,
        confirmButtonColor: "#caeb66",
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["parcels", user?.email] }),
        queryClient.invalidateQueries({ queryKey: ["admin-overview-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-overview-parcels"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-notification-parcels", user?.email] }),
      ]);

      navigate("/dashboard/user/invoices");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error?.response?.data?.message || "Could not complete payment.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-8 shadow-sm">Loading payment details...</div>;
  }

  if (isError || !parcel) {
    return <div className="rounded-2xl bg-white p-8 shadow-sm text-red-500">Parcel not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Pay Parcel</h1>
        <p className="mt-2 text-gray-600">Complete your fake payment to generate an invoice.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Parcel Info</h2>
          <p className="text-sm text-gray-600"><span className="font-semibold">Parcel ID:</span> {parcel._id}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Tracking No:</span> {parcel.trackingNo || "Will be generated after payment"}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Receiver:</span> {parcel.receiverName}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Weight:</span> {parcel.parcelWeight} kg</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Status:</span> {parcel.paymentStatus}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Amount:</span> Tk {parcel.amount}</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm space-y-8">
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          
          {/* ===== PROFESSIONAL VISA GOLD CARD ===== */}
          <div className="relative w-full aspect-video rounded-3xl shadow-2xl overflow-hidden">
            {/* Card Background - Dark Blue Gradient with Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950"></div>
            
            {/* Diagonal Stripe Pattern */}
            <div className="absolute inset-0 opacity-[0.08]">
              <svg width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <pattern id="diagonals" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="white" strokeWidth="6"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diagonals)"/>
              </svg>
            </div>

            {/* Card Content */}
            <div className="relative z-10 h-full p-8 flex flex-col justify-between">
              {/* Top Row: Visa Logo + Contactless */}
              <div className="flex justify-between items-start">
                {/* Left: Empty (for balance) */}
                <div></div>
                
                {/* Right: Contactless Icon + Visa */}
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.243m-4.243 4.243L5.121 12a3 3 0 004.243-4.243m0 0l2.879-2.879M9 3a6 6 0 000 12m3-8.121a4 4 0 015.657 5.657M9 3a6 6 0 0112 0" />
                  </svg>
                </div>
              </div>

              {/* Middle Section: Chip + Card Number */}
              <div className="space-y-6">
                {/* Chip and Wireless Icon Row */}
                <div className="flex items-center gap-4">
                  {/* EMV Chip */}
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg border-2 border-yellow-200 shadow-lg"></div>
                    <svg className="absolute inset-0 w-14 h-14 p-2 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="3" height="3"/>
                      <rect x="10" y="4" width="3" height="3"/>
                      <rect x="16" y="4" width="3" height="3"/>
                      <rect x="4" y="10" width="3" height="3"/>
                      <rect x="10" y="10" width="3" height="3"/>
                      <rect x="16" y="10" width="3" height="3"/>
                    </svg>
                  </div>
                  
                  {/* Wireless Payment Waves */}
                  <div className="space-y-1">
                    <div className="w-3 h-0.5 bg-yellow-400 rounded-full"></div>
                    <div className="w-4 h-0.5 bg-yellow-400 rounded-full"></div>
                    <div className="w-5 h-0.5 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>

                {/* Card Number - Gold with Proper Formatting */}
                <div>
                  <div className="text-yellow-400 text-xs font-bold tracking-widest mb-3 opacity-90">CARD NUMBER</div>
                  <div className="space-y-1">
                    <div className="flex gap-4 text-yellow-300 font-mono font-bold text-2xl tracking-widest">
                      <span>4000</span>
                      <span>1234</span>
                      <span>5678</span>
                      <span>9010</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Bank Id, Cardholder, Good Thru, Visa */}
              <div className="flex justify-between items-end">
                {/* Left: Bank Identifier Number */}
                <div>
                  <div className="text-yellow-300 text-xs font-bold opacity-80">4000</div>
                </div>

                {/* Center: Cardholder Name + Good Thru */}
                <div className="flex gap-12 items-end">
                  <div>
                    <div className="text-yellow-400 text-xs font-bold tracking-widest mb-1 opacity-90">CARDHOLDER</div>
                    <div className="text-yellow-300 font-bold uppercase tracking-wider text-sm">
                      {cardData.holder}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-yellow-400 text-xs font-bold tracking-widest opacity-90">GOOD THRU</div>
                    <div className="text-yellow-300 font-mono font-bold text-base tracking-wider">
                      {cardData.expiry}
                    </div>
                  </div>
                </div>

                {/* Right: VISA Logo */}
                <div className="text-right">
                  <div className="text-white text-xl font-bold font-sans">VISA</div>
                  <div className="text-yellow-400 text-xs font-bold">Gold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gradient-to-r from-[#caeb66] to-[#b8d856] rounded-2xl p-6 shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-700 opacity-75 uppercase tracking-wide">Amount</p>
                <p className="text-2xl font-bold text-gray-900">Tk {parcel.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-700 opacity-75 uppercase tracking-wide">Status</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {parcel.paymentStatus === "paid" ? "✓ Completed" : "Pending"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">Tk {parcel.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-semibold text-gray-900">Tk 0</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-semibold">
              <span className="text-gray-900">Total Payable</span>
              <span className="text-[var(--color-primary)]">Tk {parcel.amount}</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 rounded-lg p-3">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414L10 3.586l4.707 4.707a1 1 0 01-1.414 1.414L11 6.414V15a1 1 0 11-2 0V6.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span>This payment is secured with 256-bit encryption</span>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handlePayment}
              disabled={processing || parcel.paymentStatus === "paid"}
              className="w-full rounded-xl bg-[#caeb66] px-6 py-4 text-base font-semibold text-gray-900 hover:bg-[#bedd5f] disabled:cursor-not-allowed disabled:opacity-50 transition duration-200 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                {parcel.paymentStatus === "paid" ? (
                  <>✓ Already Paid</>
                ) : processing ? (
                  <>Processing...</>
                ) : (
                  <>Pay Now with Card</>
                )}
              </span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full rounded-xl border-2 border-gray-300 px-6 py-4 text-base font-semibold text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayParcel;
