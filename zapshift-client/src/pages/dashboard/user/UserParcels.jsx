import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import useUserParcels from "../../../hooks/useUserParcels";
import { MdOutlineInventory2, MdArrowForward, MdPayments, MdLocationSearching, MdVisibility } from "react-icons/md";

const UserParcels = () => {
  const navigate = useNavigate();
  const { parcels, isLoading, isError } = useUserParcels();
  const [searchParams] = useSearchParams();

  const filterStatus = searchParams.get("status");
  const filterPayment = searchParams.get("payment");

  const filteredParcels = React.useMemo(() => {
    return parcels.filter(p => {
      const matchStatus = !filterStatus || String(p.status).toLowerCase() === filterStatus.toLowerCase();
      const matchPayment = !filterPayment || String(p.paymentStatus).toLowerCase() === filterPayment.toLowerCase();
      return matchStatus && matchPayment;
    });
  }, [parcels, filterStatus, filterPayment]);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("transit") || s.includes("shipped")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("pickup") || s.includes("center")) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">My Parcels</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track your delivery requests</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
          <span className="text-xl font-black text-[#103d45]">{filteredParcels.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-40 animate-pulse rounded-3xl bg-gray-100" />)}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-10 text-center text-red-600">Failed to load parcels.</div>
      ) : filteredParcels.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
            <MdOutlineInventory2 className="text-4xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No parcels yet</h3>
          <p className="mt-2 text-sm text-gray-500">Ready to ship something? Start your first delivery request now.</p>
          <Link to="/dashboard/user/send-parcel" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#caeb66] px-6 py-3 text-sm font-bold text-[#111] transition hover:brightness-95">
            Send Parcel <MdArrowForward />
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-4">Parcel ID</th>
                  <th className="px-6 py-4">Receiver</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel._id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-[#103d45]">#{String(parcel._id).slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{parcel.receiverName}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{parcel.receiverPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-600">{parcel.senderDistrict}</span>
                        <MdArrowForward className="text-gray-300" />
                        <span className="font-semibold text-gray-600">{parcel.receiverDistrict}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-[#103d45]">Tk {parcel.amount}</p>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${parcel.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {parcel.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(parcel.normalizedStatus)}`}>
                        {parcel.normalizedStatus.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/dashboard/user/parcels/${parcel._id}`)} className="p-2 text-gray-400 hover:text-[#103d45] hover:bg-white rounded-lg transition-colors shadow-sm" title="View Details"><MdVisibility className="text-lg"/></button>
                        {parcel.paymentStatus !== "paid" && (
                          <button onClick={() => navigate(`/dashboard/user/pay/${parcel._id}`)} className="rounded-lg bg-[#caeb66] px-3 py-1.5 text-xs font-bold text-[#111] transition hover:brightness-95 flex items-center gap-1"><MdPayments /> Pay</button>
                        )}
                        <button onClick={() => navigate(`/dashboard/user/track?parcelId=${parcel._id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors shadow-sm" title="Track Parcel"><MdLocationSearching className="text-lg"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filteredParcels.map((parcel) => (
              <div key={parcel._id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-gray-400">#{String(parcel._id).slice(-8).toUpperCase()}</span>
                    <h3 className="text-base font-extrabold text-[#103d45] mt-1">{parcel.receiverName}</h3>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(parcel.normalizedStatus)}`}>
                    {parcel.normalizedStatus.replace(/-/g, " ")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-y border-gray-50 py-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">Route</span>
                    <p className="font-bold text-gray-700 mt-0.5">{parcel.senderDistrict} → {parcel.receiverDistrict}</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">Amount</span>
                    <p className="font-black text-[#103d45] mt-0.5">Tk {parcel.amount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => navigate(`/dashboard/user/parcels/${parcel._id}`)} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 py-2.5 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-white transition-all"><MdVisibility /> Details</button>
                  {parcel.paymentStatus !== "paid" && (
                    <button onClick={() => navigate(`/dashboard/user/pay/${parcel._id}`)} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#caeb66] py-2.5 text-xs font-bold text-[#111] hover:brightness-95 transition-all"><MdPayments /> Pay Now</button>
                  )}
                  <button onClick={() => navigate(`/dashboard/user/track?parcelId=${parcel._id}`)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:text-blue-500 hover:bg-white transition-all"><MdLocationSearching className="text-lg" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserParcels;
