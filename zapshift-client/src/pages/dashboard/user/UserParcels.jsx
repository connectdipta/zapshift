import React from "react";
import { Link, useNavigate } from "react-router";
import useUserParcels from "../../../hooks/useUserParcels";

const UserParcels = () => {
  const navigate = useNavigate();
  const { parcels, isLoading, isError } = useUserParcels();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">My Parcels</h1>
        <p className="mt-2 text-gray-600">Total: {parcels.length}</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">Loading parcels...</div>
      ) : isError ? (
        <div className="rounded-2xl bg-white p-10 text-center text-red-500 shadow-sm">Failed to load parcels.</div>
      ) : parcels.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="mb-3 text-gray-600">No parcels found.</p>
          <Link to="/dashboard/user/send-parcel" className="rounded-lg bg-[#caeb66] px-4 py-2 text-sm font-semibold text-[#111]">Send Your First Parcel</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
          <table className="w-full min-w-[840px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-3 py-2">Parcel ID</th>
                <th className="px-3 py-2">Receiver</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Payment</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-semibold text-gray-800">{String(parcel._id).slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-2">{parcel.receiverName}</td>
                  <td className="px-3 py-2">{parcel.senderDistrict || "-"} {"->"} {parcel.receiverDistrict || "-"}</td>
                  <td className="px-3 py-2">Tk {parcel.amount}</td>
                  <td className="px-3 py-2">{parcel.normalizedStatus}</td>
                  <td className="px-3 py-2">{parcel.paymentStatus}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/dashboard/user/parcels/${parcel._id}`)} className="rounded border border-gray-200 px-3 py-1 text-xs">View</button>
                      {parcel.paymentStatus !== "paid" && (
                        <button onClick={() => navigate(`/dashboard/user/pay/${parcel._id}`)} className="rounded bg-[#caeb66] px-3 py-1 text-xs font-semibold text-[#111]">Pay</button>
                      )}
                      <button onClick={() => navigate(`/dashboard/user/track?parcelId=${parcel._id}`)} className="rounded border border-gray-200 px-3 py-1 text-xs">Track</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserParcels;
