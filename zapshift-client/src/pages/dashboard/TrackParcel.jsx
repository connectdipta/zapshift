import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdSearch } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import axiosSecure from "../../hooks/useAxiosSecure";

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
    paid: "bg-emerald-100 text-emerald-700",
    "ready-to-pickup": "bg-amber-100 text-amber-700",
    "in-transit": "bg-blue-100 text-blue-700",
    "reached-service-center": "bg-indigo-100 text-indigo-700",
    shipped: "bg-sky-100 text-sky-700",
    "ready-for-delivery": "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    pending: "bg-gray-100 text-gray-700",
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = trackingInput.trim();
    if (value) {
      setSearchParams({ parcelId: value });
    }
  };

  return (
    <div className="rounded-3xl border border-[#dce3de] bg-gradient-to-b from-[#f7f9f8] to-[#eef2ef] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#103d45]">Track Your Consignment</h1>
        <p className="mt-1 text-sm text-[#5f6f73]">Search with Parcel ID or 6-digit tracking number to see live updates.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 rounded-2xl border border-[#e2e8e3] bg-white/90 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9699] text-lg" />
            <input
              type="text"
              placeholder="Search by parcel id or tracking no"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full rounded-xl border border-[#d8ded8] bg-[#f7f9f8] px-10 py-3 text-sm focus:outline-none focus:border-[#98bc37]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b8d94a] px-6 py-3 text-sm font-semibold text-[#1c2d1a] transition hover:brightness-95"
          >
            <MdSearch />
            Track
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="rounded-2xl border border-[#e2e8e3] bg-white p-12 text-center text-gray-600">Loading tracking info...</div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
          {error?.response?.data?.message || "Parcel not found."}
        </div>
      ) : parcel ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-3xl border border-[#e2e8e3] bg-white p-5">
            <h2 className="mb-4 text-2xl font-bold text-[#103d45]">Product details</h2>

            <div className="space-y-2 text-sm text-[#5a686b]">
              <p><span className="font-semibold text-[#243b40]">Date:</span> {parcel.createdAt ? new Date(parcel.createdAt).toLocaleString() : "-"}</p>
              <p><span className="font-semibold text-[#243b40]">Invoice:</span> {parcel.transactionId || "N/A"}</p>
              <p><span className="font-semibold text-[#243b40]">Tracking Code:</span> {parcel.trackingNo || "N/A"}</p>
            </div>

            <div className="my-4 h-px bg-[#e7ece8]" />

            <div className="space-y-2 text-sm text-[#5a686b]">
              <p><span className="font-semibold text-[#243b40]">Name:</span> {parcel.senderName || "N/A"}</p>
              <p><span className="font-semibold text-[#243b40]">Route:</span> {parcel.senderDistrict || "-"} to {parcel.receiverDistrict || "-"}</p>
              <p><span className="font-semibold text-[#243b40]">Receiver:</span> {parcel.receiverName || "N/A"}</p>
              <p><span className="font-semibold text-[#243b40]">Phone:</span> {parcel.receiverPhone || "N/A"}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[currentStatus] || statusBadgeClass.pending}`}>
                {currentStatus.replace(/-/g, " ")}
              </span>
              <span className="rounded-full bg-[#ecf4d0] px-3 py-1 text-xs font-semibold text-[#415714]">
                {String(parcel.paymentStatus || "unpaid").toLowerCase()}
              </span>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e2e8e3] bg-white p-5">
            <h2 className="mb-4 text-2xl font-bold text-[#103d45]">Tracking Updates</h2>

            <div className="space-y-3">
              {timeline.length === 0 ? (
                <p className="text-sm text-gray-500">No tracking updates yet.</p>
              ) : (
                timeline.map((item) => (
                  <div key={item.id} className="grid grid-cols-[120px_28px_1fr] gap-3 rounded-xl border border-[#edf1ee] bg-[#f8fbf9] p-3">
                    <div className="text-[11px] leading-4 text-[#7c8b8f]">{item.date}</div>
                    <div className="flex items-start justify-center">
                      <IoCheckmarkCircle className="mt-0.5 text-xl text-[#58b96f]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1f353a]">{item.status}</p>
                      <p className="text-xs text-[#637579]">{item.message}</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#7f8f93]">{item.timeAgo}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e2e8e3] bg-white p-12 text-center text-gray-600">
          No parcel found. Search using a parcel ID from your deliveries.
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
