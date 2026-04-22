import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { MdOutlineLocalShipping, MdArrowForward, MdVisibility, MdDoneAll } from "react-icons/md";

const askForOtpTracking = async (title, subtitle) => {
  return Swal.fire({
    title,
    html: `
      <p style="margin:0 0 16px;color:#64748b;font-size:14px;font-weight:500;">${subtitle}</p>
      <div id="otp-grid" style="display:grid;grid-template-columns:repeat(6,46px);gap:10px;justify-content:center;">
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
      </div>
      <style>
        .otp-cell { border:2px solid #f1f5f9; border-radius:14px; height:50px; text-align:center; font-size:22px; font-weight:900; color:#103d45; background:#f8fafc; transition:all 0.2s; }
        .otp-cell:focus { outline:none; border-color:#b8d94a; background:#fff; box-shadow:0 0 0 4px rgba(184,217,74,.15); }
      </style>
    `,
    showCancelButton: true,
    confirmButtonText: "Verify & Complete",
    confirmButtonColor: "#103d45",
    cancelButtonColor: "#f1f5f9",
    buttonsStyling: true,
    customClass: {
      confirmButton: 'rounded-xl px-8 py-3 text-sm font-bold',
      cancelButton: 'rounded-xl px-8 py-3 text-sm font-bold text-gray-400'
    },
    didOpen: () => {
      const inputs = Array.from(document.querySelectorAll(".otp-cell"));
      if (!inputs.length) return;
      inputs[0].focus();
      inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          const val = String(e.target.value || "").replace(/\D/g, "").slice(-1);
          e.target.value = val;
          if (val && index < inputs.length - 1) inputs[index + 1].focus();
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Backspace" && !input.value && index > 0) inputs[index - 1].focus();
        });
        input.addEventListener("paste", (e) => {
          e.preventDefault();
          const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
          pasted.split("").forEach((digit, idx) => { if (inputs[idx]) inputs[idx].value = digit; });
          inputs[Math.min(pasted.length, inputs.length - 1)]?.focus();
        });
      });
    },
    preConfirm: () => {
      const value = Array.from(document.querySelectorAll(".otp-cell")).map((i) => i.value).join("");
      if (value.length !== 6) {
        Swal.showValidationMessage("Please enter the full 6-digit code.");
        return false;
      }
      return value;
    },
  });
};

const RiderDeliveries = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ["rider-deliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return (res.data || []).filter(
        (p) =>
          String(p.status || "").toLowerCase() === "ready-for-delivery" &&
          String(p.deliveryRiderEmail || "").toLowerCase() === String(user?.email || "").toLowerCase()
      );
    },
  });

  const handleConfirmDelivery = async (parcel) => {
    const input = await askForOtpTracking("Delivery Verification", "Provide the 6-digit tracking/security code to complete delivery.");
    if (!input.isConfirmed || !input.value) return;

    if (String(input.value).trim() !== String(parcel.trackingNo || "")) {
      await Swal.fire({ icon: "error", title: "Invalid Code", text: "The code entered is incorrect for this parcel.", confirmButtonColor: "#ef4444" });
      return;
    }

    try {
      await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
        status: "delivered",
        confirmTrackingNo: String(input.value).trim(),
        message: "Rider verified code and confirmed successful delivery.",
      });
      await Swal.fire({ icon: "success", title: "Delivery Success!", text: "Earnings updated. Great job!", confirmButtonColor: "#b8d94a" });
      refetch();
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Server Error", text: "Could not finalize delivery at this moment." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Parcel to Delivery</h1>
          <p className="mt-1 text-sm text-gray-500">Confirm final delivery using tracking verification.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
           <span className="text-xl font-black text-[#103d45]">{parcels.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map(i => <div key={i} className="h-40 animate-pulse rounded-3xl bg-gray-100" />)}
        </div>
      ) : parcels.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
            <MdOutlineLocalShipping className="text-4xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No active deliveries</h3>
          <p className="mt-2 text-sm text-gray-500">When you're assigned delivery tasks, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {parcels.map((p) => (
            <div key={p._id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4 transition hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{String(p._id).slice(-8).toUpperCase()}</span>
                  <h3 className="text-base font-extrabold text-[#103d45] mt-1 truncate">{p.receiverName}</h3>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[9px] font-black uppercase text-emerald-600 tracking-tighter">Ready</span>
              </div>

              <div className="flex flex-col gap-1 border-y border-gray-50 py-4">
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Route</p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                   <span>{p.senderDistrict}</span>
                   <MdArrowForward className="text-gray-300" />
                   <span>{p.receiverDistrict}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                 <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="flex-1 rounded-xl bg-gray-50 border border-gray-100 py-3 text-xs font-bold text-gray-600 transition hover:bg-white flex items-center justify-center gap-2"><MdVisibility /> Details</button>
                 <button onClick={() => handleConfirmDelivery(p)} className="flex-1 rounded-xl bg-[#caeb66] py-3 text-xs font-black text-[#1c2d1a] shadow-sm shadow-lime-100 transition hover:brightness-95 flex items-center justify-center gap-2"><MdDoneAll /> Confirm</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderDeliveries;
