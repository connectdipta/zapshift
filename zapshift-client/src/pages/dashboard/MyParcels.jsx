import React from "react";
import { MdCheckCircle, MdRefresh, MdLocalShipping, MdAccessTime } from "react-icons/md";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";

const MyParcels = () => {
  const navigate = useNavigate();
  const { data: parcels = [], isLoading, isError } = useQuery({
    queryKey: ["admin-shipping"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return (res.data || []).map((parcel) => ({
        ...parcel,
        normalizedStatus: String(parcel.status || "pending").toLowerCase(),
        paymentStatus: String(parcel.paymentStatus || "unpaid").toLowerCase(),
        amount: Number(parcel.amount) || 0,
        parcelWeight: Number(parcel.parcelWeight) || 0,
      }));
    },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return MdCheckCircle;
      case "processing":
        return MdRefresh;
      case "in-transit":
        return MdLocalShipping;
      case "pending":
        return MdAccessTime;
      default:
        return MdAccessTime;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "in-transit":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalCount = parcels.length;
  const returnCount = parcels.filter((parcel) => parcel.normalizedStatus === "waiting").length;
  const paidCount = parcels.filter((parcel) => parcel.paymentStatus === "paid").length;

  const handleDelete = () => {
    Swal.fire({
      icon: "info",
      title: "Not Available",
      text: "Delete action is not enabled yet.",
      confirmButtonColor: "#caeb66",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0b3b46]">Shipping</h1>
        <p className="mt-2 text-gray-600">Live delivery records based on your parcels.</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-600">Loading parcels...</p>
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-red-500">Failed to load parcels.</p>
        </div>
      ) : parcels.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-600 mb-4">No parcels found</p>
          <Link
            to="/dashboard/send-parcel"
            className="inline-block bg-[var(--color-primary)] text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Send Your First Parcel
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{totalCount}</p>
            </div>
            <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4">
              <p className="text-xs text-gray-500">Return</p>
              <p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{returnCount}</p>
            </div>
            <div className="rounded-xl border border-[#ececec] bg-[#f7f7f7] p-4">
              <p className="text-xs text-gray-500">Paid Return</p>
              <p className="mt-1 text-3xl font-bold text-[#1f1f1f]">{paidCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm hidden md:block overflow-x-auto">
            <table className="w-full min-w-[920px] text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">
                    Parcel ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Store
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Recipient Info
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Delivery Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Payment
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => {
                  const normalized = parcel.normalizedStatus;
                  const StatusIcon = getStatusIcon(normalized);
                  return (
                    <tr
                      key={parcel._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-800 font-semibold">
                        #PTD {parcel._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {parcel.senderName || "ZapShift Store"}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-800">{parcel.receiverName}</p>
                        <p className="text-[11px] text-gray-500">{parcel.receiverAddress || "Address not set"}</p>
                        <p className="text-[11px] text-gray-500">{parcel.receiverPhone || "Phone not set"}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
                            normalized
                          )}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {normalized}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[11px] text-gray-600">COD Tk {Math.round(parcel.amount * 0.2)}</p>
                        <p className="text-[11px] text-gray-600">Charge Tk {parcel.amount}</p>
                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${parcel.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {parcel.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/manage/${parcel._id}`)}
                            className="rounded-md bg-[#caeb66] px-3 py-1 text-[11px] font-semibold text-[#111] hover:bg-[#bedd5f]"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/parcels/${parcel._id}`)}
                            className="rounded-md border border-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50"
                          >
                            View
                          </button>
                          <button onClick={handleDelete} className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-500 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="space-y-4 md:hidden">
            {parcels.map((parcel) => {
              const normalized = parcel.normalizedStatus;
              const StatusIcon = getStatusIcon(normalized);
              return (
                <div
                  key={parcel._id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-semibold text-gray-900">
                      #PTD {parcel._id?.slice(-8).toUpperCase()}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        normalized
                      )}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {normalized || "pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Store: <span className="font-semibold">{parcel.senderName || "ZapShift Store"}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    To: {parcel.receiverName} ({parcel.receiverPhone || "N/A"})
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">COD Tk {Math.round(parcel.amount * 0.2)}</p>
                    <p className="text-xs text-gray-600">Charge Tk {parcel.amount}</p>
                  </div>
                  <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${parcel.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {parcel.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/parcels/${parcel._id}`)}
                      className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/manage/${parcel._id}`)}
                      className="rounded-md bg-[#caeb66] px-3 py-1 text-xs font-semibold text-[#111] hover:bg-[#bedd5f]"
                    >
                      Manage
                    </button>
                    <button
                      onClick={handleDelete}
                      className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-100"
                    >
                      Delete
                    </button>
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
