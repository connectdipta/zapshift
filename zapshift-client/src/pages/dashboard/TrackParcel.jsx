import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdSearch, MdOutlineHistory, MdArrowBack, MdLocalShipping, MdInventory2 } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import axiosSecure from "../../hooks/useAxiosSecure";
import useUserParcels from "../../hooks/useUserParcels";
import { motion, AnimatePresence } from "framer-motion";

const formatTimeAgo = (dateValue) => {
  if (!dateValue) return "just now";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "just now";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  const matched = intervals.find((item) => seconds >= item.seconds);
  if (!matched) return "just now";

  const count = Math.floor(seconds / matched.seconds);
  return `${count} ${matched.label}${count > 1 ? "s" : ""} ago`;
};

const TrackParcel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingInput, setTrackingInput] = useState(searchParams.get("parcelId") || "");
  const activeQuery = searchParams.get("parcelId") || "";

  // Get all user parcels for the list
  const { parcels: allParcels, isLoading: isParcelsLoading } = useUserParcels();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tracking-search", activeQuery],
    enabled: !!activeQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/track/${encodeURIComponent(activeQuery)}`);
      return res.data || { parcel: null, events: [] };
    },
  });

  const parcel = data?.parcel || null;
  const events = data?.events || [];

  const timeline = useMemo(() => {
    return events.map((event) => ({
      id: event._id,
      status: String(event.status || "pending").replace(/-/g, " "),
      message: event.message || "Status updated",
      date: event.createdAt ? new Date(event.createdAt).toLocaleString() : "-",
      timeAgo: formatTimeAgo(event.createdAt),
    }));
  }, [events]);

  const currentStatus = String(parcel?.status || "pending").toLowerCase();
  
  const statusBadgeClass = {
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "ready-to-pickup": "bg-amber-100 text-amber-700 border-amber-200",
    "in-transit": "bg-blue-100 text-blue-700 border-blue-200",
    "reached-service-center": "bg-indigo-100 text-indigo-700 border-indigo-200",
    shipped: "bg-sky-100 text-sky-700 border-sky-200",
    "ready-for-delivery": "bg-orange-100 text-orange-700 border-orange-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = trackingInput.trim();
    if (value) {
      setSearchParams({ parcelId: value });
    }
  };

  const handleSelectParcel = (id) => {
    setTrackingInput(id);
    setSearchParams({ parcelId: id });
  };

  const clearSearch = () => {
    setTrackingInput("");
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="rounded-3xl border border-[#dce3de] bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#103d45]">Track Your Consignment</h1>
            <p className="mt-1 text-sm text-[#5f6f73]">Search with Parcel ID or 6-digit tracking number to see live updates.</p>
          </div>
          {activeQuery && (
            <button 
              onClick={clearSearch}
              className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <MdArrowBack />
              Back to List
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="rounded-2xl border border-[#e2e8e3] bg-[#f8fbfa] p-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9699] text-xl" />
              <input
                type="text"
                placeholder="Search by parcel id or tracking no..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full rounded-xl border-none bg-transparent px-12 py-3.5 text-sm focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b8d94a] px-8 py-3.5 text-sm font-bold text-[#1c2d1a] transition hover:brightness-95 active:scale-95"
            >
              <MdSearch className="text-lg" />
              Track Now
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {!activeQuery ? (
          /* All Parcels List */
          <motion.div
            key="parcel-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-2">
              <MdOutlineHistory className="text-xl text-[#b8d94a]" />
              <h2 className="text-xl font-bold text-[#103d45]">Your Recent Parcels</h2>
            </div>

            {isParcelsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : allParcels.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <MdInventory2 className="mx-auto mb-4 text-5xl text-gray-200" />
                <p className="text-gray-500">You haven't sent any parcels yet.</p>
                <button className="mt-4 text-sm font-bold text-[#b8d94a] hover:underline">Send your first parcel</button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allParcels.map((p) => (
                  <motion.button
                    key={p._id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectParcel(p.trackingNo || p._id)}
                    className="flex flex-col overflow-hidden rounded-3xl border border-[#e2e8e3] bg-white p-5 text-left transition-all hover:border-[#b8d94a] hover:shadow-lg hover:shadow-lime-100/50"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50 text-[#b8d94a]">
                        <MdLocalShipping className="text-xl" />
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass[p.normalizedStatus] || statusBadgeClass.pending}`}>
                        {p.normalizedStatus.replace(/-/g, " ")}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tracking No</p>
                      <p className="text-sm font-extrabold text-[#103d45]">{p.trackingNo || "Pending..."}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">To</p>
                        <p className="text-xs font-semibold text-gray-700">{p.receiverDistrict}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</p>
                        <p className="text-xs font-semibold text-gray-700">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* Tracking Details */
          <motion.div
            key="tracking-details"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-3xl border border-[#e2e8e3] bg-white p-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#b8d94a] border-t-transparent" />
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <MdInventory2 className="text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-red-800">Parcel Not Found</h3>
                <p className="mt-1 text-sm text-red-600">{error?.response?.data?.message || "Please check the tracking number and try again."}</p>
                <button onClick={clearSearch} className="mt-6 font-bold text-red-700 hover:underline">Go back to my parcels</button>
              </div>
            ) : parcel ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                {/* Details Section */}
                <section className="space-y-6">
                  <div className="overflow-hidden rounded-3xl border border-[#e2e8e3] bg-white shadow-sm">
                    <div className="bg-[#103d45] px-6 py-4 text-white">
                      <h2 className="text-lg font-bold">Consignment Info</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tracking No</p>
                            <p className="text-sm font-extrabold text-[#103d45]">{parcel.trackingNo || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Transaction ID</p>
                            <p className="text-sm font-semibold text-[#103d45]">{parcel.transactionId || "N/A"}</p>
                          </div>
                        </div>
                        <div className="space-y-4 text-right">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Created</p>
                            <p className="text-sm font-semibold text-gray-700">{new Date(parcel.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment Status</p>
                            <span className="inline-block rounded-full bg-lime-100 px-3 py-0.5 text-[10px] font-bold uppercase text-[#415714]">
                              {parcel.paymentStatus || "unpaid"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="my-6 h-px bg-gray-100" />

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin</p>
                          <p className="text-sm font-bold text-[#103d45]">{parcel.senderDistrict}</p>
                          <p className="text-xs text-gray-500">{parcel.senderName}</p>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Destination</p>
                          <p className="text-sm font-bold text-[#103d45]">{parcel.receiverDistrict}</p>
                          <p className="text-xs text-gray-500">{parcel.receiverName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#e2e8e3] bg-[#f8fbfa] p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl text-[#b8d94a] shadow-sm">
                        <MdLocalShipping />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Status</p>
                        <p className="text-xl font-black text-[#103d45] uppercase tracking-tight">{currentStatus.replace(/-/g, " ")}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Timeline Section */}
                <section className="rounded-3xl border border-[#e2e8e3] bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#103d45]">Tracking Timeline</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time updates</span>
                  </div>

                  <div className="relative space-y-8">
                    {/* Vertical Line - hidden on mobile to avoid clashing with simplified layout */}
                    <div className="absolute left-[139px] top-2 hidden h-[calc(100%-16px)] w-0.5 bg-gray-100 sm:block" />

                    {timeline.length === 0 ? (
                      <p className="py-12 text-center text-sm text-gray-500">No tracking updates yet.</p>
                    ) : (
                      timeline.map((item, idx) => (
                        <div key={item.id} className="relative flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                          {/* Date/Time Column */}
                          <div className="sm:w-32 sm:pt-1 sm:text-right">
                            <p className="text-[10px] font-bold text-gray-400">{item.date.split(',')[0]}</p>
                            <p className="text-[11px] font-black text-[#103d45]">{item.date.split(',')[1]}</p>
                          </div>
                          
                          {/* Icon/Dot - only visible on tablet/desktop */}
                          <div className={`relative z-10 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border-4 border-white sm:flex ${idx === 0 ? 'bg-[#b8d94a] shadow-lg shadow-lime-200' : 'bg-gray-200'}`}>
                            {idx === 0 && <div className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />}
                          </div>

                          {/* Status Content */}
                          <div className={`flex-1 rounded-2xl p-4 ${idx === 0 ? 'bg-lime-50 border border-lime-100 shadow-sm' : 'bg-gray-50 border border-gray-100'}`}>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-extrabold text-[#103d45] uppercase tracking-tight">{item.status}</p>
                              {idx === 0 && (
                                <span className="rounded-full bg-[#b8d94a] px-2 py-0.5 text-[8px] font-black uppercase text-[#1c2d1a]">Latest</span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#5a686b]">{item.message}</p>
                            <p className="mt-2 text-[10px] font-bold text-[#b8d94a] uppercase tracking-widest">{item.timeAgo}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackParcel;
