import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useParcelById from "../../hooks/useParcelById";
import axiosSecure from "../../hooks/useAxiosSecure";

const PayParcel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: parcel, isLoading, isError } = useParcelById(id);
  const [processing, setProcessing] = useState(false);
  const [cardForm, setCardForm] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvc: "",
  });

  const updateField = (key, value) => {
    setCardForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePayment = async () => {
    if (!cardForm.holder || !cardForm.number || !cardForm.expiry || !cardForm.cvc) {
      await Swal.fire({
        icon: "warning",
        title: "Incomplete payment form",
        text: "Please fill in all card fields before continuing.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

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

        <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Summary</h2>
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Card holder name"
              value={cardForm.holder}
              onChange={(e) => updateField("holder", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Card number"
              value={cardForm.number}
              onChange={(e) => updateField("number", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardForm.expiry}
                onChange={(e) => updateField("expiry", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
              <input
                type="password"
                placeholder="CVC"
                value={cardForm.cvc}
                onChange={(e) => updateField("cvc", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-[#f8f8f8] p-4 text-sm text-gray-600">
            Total payable: <span className="font-semibold text-gray-900">Tk {parcel.amount}</span>
          </div>
          <button
            onClick={handlePayment}
            disabled={processing || parcel.paymentStatus === "paid"}
            className="w-full rounded-lg bg-[#caeb66] px-4 py-3 text-sm font-semibold text-[#111] hover:bg-[#bedd5f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {parcel.paymentStatus === "paid" ? "Already Paid" : processing ? "Processing..." : "Pay Now"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayParcel;
