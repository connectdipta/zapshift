import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const askForOtpTracking = async (title, subtitle) => {
  return Swal.fire({
    title,
    html: `
      <p style="margin:0 0 12px;color:#4b5563;font-size:13px;">${subtitle}</p>
      <div id="otp-grid" style="display:grid;grid-template-columns:repeat(6,42px);gap:8px;justify-content:center;">
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
        <input class="otp-cell" maxlength="1" inputmode="numeric" />
      </div>
      <style>
        .otp-cell { border:1px solid #d1d5db; border-radius:10px; height:44px; text-align:center; font-size:20px; font-weight:700; }
        .otp-cell:focus { outline:none; border-color:#98bc37; box-shadow:0 0 0 3px rgba(152,188,55,.2); }
      </style>
    `,
    showCancelButton: true,
    confirmButtonText: "Confirm Delivery",
    confirmButtonColor: "#caeb66",
    didOpen: () => {
      const inputs = Array.from(document.querySelectorAll(".otp-cell"));
      if (!inputs.length) return;

      inputs[0].focus();

      inputs.forEach((input, index) => {
        input.addEventListener("input", (event) => {
          const value = String(event.target.value || "").replace(/\D/g, "").slice(-1);
          event.target.value = value;
          if (value && index < inputs.length - 1) inputs[index + 1].focus();
        });

        input.addEventListener("keydown", (event) => {
          if (event.key === "Backspace" && !input.value && index > 0) {
            inputs[index - 1].focus();
          }
        });

        input.addEventListener("paste", (event) => {
          event.preventDefault();
          const pasted = (event.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
          pasted.split("").forEach((digit, idx) => {
            if (inputs[idx]) inputs[idx].value = digit;
          });
          const nextIndex = Math.min(pasted.length, inputs.length - 1);
          inputs[nextIndex]?.focus();
        });
      });
    },
    preConfirm: () => {
      const value = Array.from(document.querySelectorAll(".otp-cell")).map((input) => input.value).join("");
      if (value.length !== 6) {
        Swal.showValidationMessage("Please enter all 6 digits.");
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
    const input = await askForOtpTracking(
      "Confirm Delivery",
      "Enter the 6-digit tracking number to complete this delivery."
    );

    if (!input.isConfirmed || !input.value) return;

    if (String(input.value).trim() !== String(parcel.trackingNo || "")) {
      await Swal.fire({
        icon: "error",
        title: "Tracking mismatch",
        text: "The entered tracking number does not match this parcel.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
      status: "delivered",
      confirmTrackingNo: String(input.value).trim(),
      message: "Delivery rider confirmed successful parcel delivery.",
    });

    await Swal.fire({
      icon: "success",
      title: "Delivery confirmed",
      text: "Delivery completed. Your earning increased by Tk 20.",
      confirmButtonColor: "#caeb66",
    });

    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Parcel to Delivery</h1>
        <p className="mt-2 text-gray-600">Confirm final delivery using tracking verification.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-3 py-2">Parcel ID</th>
              <th className="px-3 py-2">Route</th>
              <th className="px-3 py-2">Assigned Rider</th>
              <th className="px-3 py-2">Tracking No</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Loading deliveries...</td></tr>
            ) : parcels.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No active delivery tasks.</td></tr>
            ) : (
              parcels.map((p) => (
                <tr key={p._id} className="border-b border-gray-100">
                  <td className="px-3 py-2">{String(p._id).slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-2">{p.senderDistrict || "-"} {"->"} {p.receiverDistrict || "-"}</td>
                  <td className="px-3 py-2">{p.deliveryRiderName || p.deliveryRiderEmail || "N/A"}</td>
                  <td className="px-3 py-2">{p.trackingNo || "-"}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/dashboard/parcels/${p._id}`)} className="rounded border border-gray-200 px-3 py-1 text-xs">View</button>
                      <button onClick={() => handleConfirmDelivery(p)} className="rounded bg-[#caeb66] px-3 py-1 text-xs font-semibold text-[#111]">Confirm Delivery</button>
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

export default RiderDeliveries;
