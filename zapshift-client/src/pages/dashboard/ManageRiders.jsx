import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axiosSecure from "../../hooks/useAxiosSecure";

const ManageRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);

  const { data: riders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/riders/list");
      return res.data || [];
    },
  });

  const review = async (id, action) => {
    await axiosSecure.patch(`/users/riders/${id}/review`, { action });
    await Swal.fire({
      icon: "success",
      title: action === "approve" ? "Rider approved" : "Rider rejected",
      confirmButtonColor: "#caeb66",
    });
    setSelectedRider(null);
    refetch();
  };

  const removeRider = async (rider) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete rider?",
      text: rider.applicationStatus === "approved"
        ? "This will remove the approved rider and reset the user's rider status."
        : "This will remove the rider application.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    await axiosSecure.delete(`/users/riders/${rider._id}`);
    await Swal.fire({
      icon: "success",
      title: "Rider deleted",
      confirmButtonColor: "#caeb66",
    });
    setSelectedRider(null);
    refetch();
  };

  const statusLabel = (status) => {
    const value = String(status || "pending").toLowerCase();
    const classes = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${classes[value] || classes.pending}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Manage Riders</h1>
        <p className="mt-2 text-gray-600">Review rider applications, inspect details, and approve or reject.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">District</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">Loading riders...</td></tr>
            ) : riders.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">No rider requests found.</td></tr>
            ) : (
              riders.map((rider) => (
                <tr key={rider._id} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-medium text-gray-900">{rider.name || "User"}</td>
                  <td className="px-3 py-2 text-gray-600">{rider.email}</td>
                  <td className="px-3 py-2 text-gray-600">{rider.district || "-"}</td>
                  <td className="px-3 py-2">{statusLabel(rider.applicationStatus || rider.riderStatus)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRider(rider)}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        View details
                      </button>
                      {String(rider.applicationStatus || rider.riderStatus).toLowerCase() === "approved" ? (
                        <button onClick={() => removeRider(rider)} className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                          Delete
                        </button>
                      ) : (
                        <>
                          <button onClick={() => review(rider._id, "approve")} className="rounded-md bg-[#caeb66] px-3 py-1 text-xs font-semibold text-[#111]">Approve</button>
                          <button onClick={() => review(rider._id, "reject")} className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRider ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Rider Application Details</h2>
                <p className="mt-1 text-sm text-gray-500">Submitted rider information for admin review.</p>
              </div>
              <button
                onClick={() => setSelectedRider(null)}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Name</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.name || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.email || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Age</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.age || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">District</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.district || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">NID</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.nid || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.contact || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Preferred Warehouse</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{selectedRider.warehouse || "-"}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Application Status</p>
                <div className="mt-1">{statusLabel(selectedRider.applicationStatus || selectedRider.riderStatus)}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
              {String(selectedRider.applicationStatus || selectedRider.riderStatus).toLowerCase() === "approved" ? (
                <button
                  onClick={() => removeRider(selectedRider)}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              ) : (
                <>
                  <button
                    onClick={() => review(selectedRider._id, "approve")}
                    className="rounded-lg bg-[#caeb66] px-4 py-2 text-sm font-semibold text-[#111]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => review(selectedRider._id, "reject")}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ManageRiders;
