import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axiosSecure from "../../hooks/useAxiosSecure";
import { MdOutlinePeopleAlt, MdVerified, MdOutlineEmail, MdLocationOn, MdDeleteOutline, MdVisibility, MdClose, MdPerson } from "react-icons/md";

const ManageRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchParams] = useSearchParams();
  const filterStatus = searchParams.get("status");

  const { data: riders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/riders/list");
      return res.data || [];
    },
  });

  const filteredRiders = React.useMemo(() => {
    if (!filterStatus) return riders;
    return riders.filter(r => String(r.applicationStatus || r.riderStatus).toLowerCase() === filterStatus.toLowerCase());
  }, [riders, filterStatus]);

  const review = async (id, action) => {
    try {
      await axiosSecure.patch(`/users/riders/${id}/review`, { action });
      await Swal.fire({
        icon: "success",
        title: action === "approve" ? "Rider approved" : "Rider rejected",
        confirmButtonColor: "#b8d94a",
      });
      setSelectedRider(null);
      refetch();
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Action failed", text: error.message });
    }
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

    try {
      await axiosSecure.delete(`/users/riders/${rider._id}`);
      await Swal.fire({ icon: "success", title: "Rider deleted", confirmButtonColor: "#b8d94a" });
      setSelectedRider(null);
      refetch();
    } catch (error) {
      await Swal.fire({ icon: "error", title: "Delete failed", text: error.message });
    }
  };

  const statusLabel = (status) => {
    const value = String(status || "pending").toLowerCase();
    const colors = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      approved: "bg-green-50 text-green-600 border-green-100",
      rejected: "bg-red-50 text-red-600 border-red-100",
    };

    return (
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${colors[value] || colors.pending}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Manage Riders</h1>
          <p className="mt-1 text-sm text-gray-500">Review and verify applications for new delivery riders.</p>
        </div>
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
           <MdOutlinePeopleAlt className="text-gray-400 text-xl" />
           <span className="text-lg font-black text-[#103d45]">{filteredRiders.length}</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <th className="px-6 py-4">Rider</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-sm">Fetching riders...</td></tr>
            ) : filteredRiders.length === 0 ? (
              <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-sm">No applications found</td></tr>
            ) : (
              filteredRiders.map((rider) => (
                <tr key={rider._id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{rider.name || "Anonymous"}</p>
                    <p className="text-[10px] font-medium text-gray-400">{rider.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-600">{rider.contact || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <MdLocationOn className="text-gray-300" />
                      {rider.district || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">{statusLabel(rider.applicationStatus || rider.riderStatus)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => setSelectedRider(rider)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-[#caeb66] hover:text-[#1c2d1a] transition-all"><MdVisibility /></button>
                       {String(rider.applicationStatus || rider.riderStatus).toLowerCase() === 'approved' ? (
                         <button onClick={() => removeRider(rider)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><MdDeleteOutline /></button>
                       ) : (
                         <div className="flex gap-2">
                            <button onClick={() => review(rider._id, "approve")} className="rounded-lg bg-[#caeb66] px-3 py-1.5 text-[10px] font-black uppercase text-[#1c2d1a]">Approve</button>
                            <button onClick={() => review(rider._id, "reject")} className="rounded-lg bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase text-rose-500">Reject</button>
                         </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:hidden">
        {filteredRiders.map((rider) => (
          <div key={rider._id} className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-base font-extrabold text-[#103d45]">{rider.name || "Anonymous"}</h3>
                 <p className="text-[10px] font-medium text-gray-400">{rider.email}</p>
               </div>
               {statusLabel(rider.applicationStatus || rider.riderStatus)}
             </div>
             
             <div className="flex items-center gap-4 text-[11px] font-bold text-gray-600 border-y border-gray-50 py-3">
                <div className="flex items-center gap-1"><MdLocationOn className="text-gray-300" /> {rider.district || "-"}</div>
                <div className="flex items-center gap-1 font-mono">{rider.contact || "-"}</div>
             </div>

             <div className="flex gap-2 pt-1">
                <button onClick={() => setSelectedRider(rider)} className="flex-1 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-gray-600 border border-gray-100">Details</button>
                {String(rider.applicationStatus || rider.riderStatus).toLowerCase() === 'approved' ? (
                  <button onClick={() => removeRider(rider)} className="rounded-xl bg-rose-50 text-rose-500 px-4 py-2.5 border border-rose-100"><MdDeleteOutline /></button>
                ) : (
                  <button onClick={() => review(rider._id, "approve")} className="flex-1 rounded-xl bg-[#caeb66] py-2.5 text-xs font-black text-[#1c2d1a]">Approve</button>
                )}
             </div>
          </div>
        ))}
      </div>

      {/* Rider Detail Modal */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#103d45]/20 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2.5rem] bg-white p-6 shadow-2xl sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#b8d94a]" />
            <button onClick={() => setSelectedRider(null)} className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"><MdClose className="text-xl" /></button>
            
            <div className="mb-8">
               <h2 className="text-2xl font-black text-[#103d45]">Rider Application</h2>
               <p className="text-sm font-medium text-gray-400">Detailed verification data</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Name", value: selectedRider.name, icon: MdPerson },
                { label: "Email", value: selectedRider.email, icon: MdOutlineEmail },
                { label: "District", value: selectedRider.district, icon: MdLocationOn },
                { label: "NID Number", value: selectedRider.nid, icon: MdVerified },
                { label: "Age", value: `${selectedRider.age} Years` },
                { label: "Contact", value: selectedRider.contact },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-[#103d45] truncate">{item.value || "-"}</p>
                </div>
              ))}
              <div className="rounded-2xl bg-gray-50/50 p-4 border border-gray-100 sm:col-span-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferred Warehouse</p>
                <p className="mt-1 text-sm font-bold text-[#103d45]">{selectedRider.warehouse || "-"}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {String(selectedRider.applicationStatus || selectedRider.riderStatus).toLowerCase() === "approved" ? (
                <button onClick={() => removeRider(selectedRider)} className="rounded-xl bg-rose-500 px-8 py-3 text-sm font-black text-white transition hover:brightness-110 active:scale-95 shadow-lg shadow-rose-100">Remove Rider</button>
              ) : (
                <>
                  <button onClick={() => review(selectedRider._id, "approve")} className="rounded-xl bg-[#caeb66] px-8 py-3 text-sm font-black text-[#1c2d1a] transition hover:brightness-95 active:scale-95 shadow-lg shadow-lime-100">Approve Application</button>
                  <button onClick={() => review(selectedRider._id, "reject")} className="rounded-xl border border-gray-100 bg-white px-8 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-50 active:scale-95">Reject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRiders;
