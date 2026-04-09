import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  MdLocalShipping,
  MdMoreVert,
  MdKeyboardArrowDown,
  MdFilterList,
  MdEdit,
  MdArrowForward,
  MdArrowBack,
  MdInfoOutline,
  MdAdd,
} from "react-icons/md";
import useUserParcels from "../../../hooks/useUserParcels";

const UserDashboardHome = () => {
  const navigate = useNavigate();
  const { parcels, isLoading, isError } = useUserParcels();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const stats = [
    { title: "To Pay", value: parcels.filter((p) => p.paymentStatus !== "paid").length.toLocaleString() },
    { title: "Ready Pick Up", value: parcels.filter((p) => p.normalizedStatus === "ready-to-pickup").length.toLocaleString() },
    { title: "In Transit", value: parcels.filter((p) => p.normalizedStatus === "in-transit").length.toLocaleString() },
    { title: "Ready to Deliver", value: parcels.filter((p) => p.normalizedStatus === "ready-for-delivery").length.toLocaleString() },
    { title: "Delivered", value: parcels.filter((p) => p.normalizedStatus === "delivered").length.toLocaleString() },
  ];

  const shippingRows = parcels
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((p) => ({
      id: `#${String(p._id || "").slice(-6).toUpperCase() || "PARCEL"}`,
      client: p.receiverName || "N/A",
      date: p.createdAt.toLocaleDateString(),
      weight: `${p.parcelWeight || 0} kg`,
      shipper: p.parcelType === "document" ? "Document" : "Parcel",
      price: `${p.amount.toFixed(2)}`,
      status: p.normalizedStatus,
      parcelId: p._id,
    }));

  const totalPages = Math.max(1, Math.ceil(shippingRows.length / rowsPerPage));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return shippingRows.slice(start, start + rowsPerPage);
  }, [shippingRows, currentPage]);

  const statusColor = {
    delivered: "bg-[#dff7e9] text-[#2d8f55]",
    "in-transit": "bg-[#e8edff] text-[#4368e8]",
    waiting: "bg-[#ffe6e6] text-[#e36363]",
    pending: "bg-[#fff2db] text-[#d18b23]",
    processing: "bg-[#e8edff] text-[#4368e8]",
    "ready-to-pickup": "bg-[#fff2db] text-[#d18b23]",
    "ready-for-delivery": "bg-[#e8edff] text-[#4368e8]",
    "reached-service-center": "bg-[#edf1ff] text-[#5465bf]",
    shipped: "bg-[#eaf3ff] text-[#3063cc]",
  };

  const lateInvoices = parcels.filter((p) => p.paymentStatus !== "paid").slice(0, 6);

  const damagedCount = parcels.filter((p) => p.normalizedStatus === "waiting").length;
  const weatherDelayCount = parcels.filter((p) => p.normalizedStatus === "in-transit").length;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#1f1f1f]">Dashboard Overview</h1>
          <p className="text-[11px] text-gray-500">You can access all your data and information from anywhere.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/user/send-parcel")}
          className="inline-flex items-center gap-1 rounded-lg bg-[#caeb66] px-3 py-2 text-xs font-semibold text-[#111] hover:bg-[#bedd5f]"
        >
          <MdAdd className="text-sm" />
          Add Parcel
        </button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <div key={item.title} className="rounded-xl border border-[#e8e8e8] bg-[#f8f8f8] p-3">
            <div className="mb-1 flex items-center gap-2 text-[11px] text-gray-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#dddddd]">
                <MdLocalShipping className="text-[12px]" />
              </span>
              {item.title}
            </div>
            <p className="pl-7 text-[30px] font-semibold leading-none text-[#1f1f1f]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#262626]">Overall Statistics</h2>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-3 py-1 text-xs text-gray-600">
              This Week
              <MdKeyboardArrowDown className="text-sm" />
            </button>
            <button className="rounded-full border border-[#dddddd] bg-white p-1.5 text-gray-500">
              <MdMoreVert className="text-sm" />
            </button>
          </div>
        </div>

        <div className="relative h-[250px] rounded-lg border border-[#e2e2e2] bg-[#f3f3f3] p-3">
          <div className="absolute inset-3 bg-[linear-gradient(to_right,#e4e4e4_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e4_1px,transparent_1px)] bg-[size:72px_44px]" />
          <div className="absolute left-2 top-3 flex h-[calc(100%-24px)] flex-col justify-between text-[10px] text-gray-400">
            <span>$25k</span>
            <span>$20k</span>
            <span>$15k</span>
            <span>$10k</span>
            <span>$5k</span>
          </div>

          <div className="absolute inset-x-12 top-3 bottom-8">
            <svg viewBox="0 0 900 220" className="relative h-full w-full">
              <defs>
                <linearGradient id="userAreaFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#caeb66" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#caeb66" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M0,150 L80,145 L140,95 L220,95 L290,150 L350,150 L390,182 L450,182 L520,120 L590,95 L680,95 L740,140 L800,140 L840,65 L885,65 L900,150 L900,220 L0,220 Z"
                fill="url(#userAreaFill)"
              />
              <path
                d="M0,150 L80,145 L140,95 L220,95 L290,150 L350,150 L390,182 L450,182 L520,120 L590,95 L680,95 L740,140 L800,140 L840,65 L885,65 L900,150"
                fill="none"
                stroke="#b8d94a"
                strokeWidth="3"
              />
              <line x1="450" y1="0" x2="450" y2="220" stroke="#c6d98a" strokeDasharray="5 5" />
            </svg>
          </div>

          <div className="absolute left-[49%] top-[72px] rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-500 shadow-sm">
            Sun, Jul 13, 2025
            <p className="text-[10px] font-semibold text-gray-700">$15,210.00</p>
          </div>

          <div className="absolute bottom-3 left-12 right-8 flex items-center justify-between text-[10px] text-gray-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#262626]">Shipping Reports</h2>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-3 py-1 text-xs text-gray-600">
              This Week
              <MdKeyboardArrowDown className="text-sm" />
            </button>
            <button className="rounded-full border border-[#dddddd] bg-white p-1.5 text-gray-500">
              <MdFilterList className="text-sm" />
            </button>
            <button className="rounded-full border border-[#dddddd] bg-white p-1.5 text-gray-500">
              <MdMoreVert className="text-sm" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#e0e0e0] bg-white">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="bg-[#f6f6f6] text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">Client</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Weight</th>
                <th className="px-3 py-2 font-medium">Shipper</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">Loading shipping reports...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-red-500">Failed to load shipping reports.</td>
                </tr>
              ) : shippingRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">No parcel data found.</td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={`${row.id}-${row.date}`} className="border-t border-[#efefef] text-gray-600">
                    <td className="px-3 py-2">{row.id}</td>
                    <td className="px-3 py-2">{row.client}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">{row.weight}</td>
                    <td className="px-3 py-2">{row.shipper}</td>
                    <td className="px-3 py-2">{row.price}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor[row.status] || statusColor.pending}`}>
                        {row.status.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => navigate(`/dashboard/user/parcels/${row.parcelId}`)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700">
                        <MdEdit className="text-sm" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-3 py-1 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MdArrowBack /> Previous
          </button>
          <div className="flex items-center gap-3 text-gray-400">
            {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${currentPage === page ? "bg-[#caeb66] text-[#1f1f1f]" : "text-gray-500"}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-3 py-1 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <MdArrowForward />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#262626]">Late Invoices</h2>
            <Link to="/dashboard/user/invoices" className="rounded-full bg-[#caeb66] px-3 py-1 text-[11px] font-medium text-[#1f1f1f]">View All Invoices</Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
            <table className="w-full text-xs">
              <thead className="bg-[#f6f6f6] text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">No</th>
                  <th className="px-3 py-2 text-left font-medium">Price</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {lateInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-500">No late invoices.</td>
                  </tr>
                ) : (
                  lateInvoices.map((parcel) => (
                    <tr key={parcel._id} className="border-t border-[#efefef] text-gray-600">
                      <td className="px-3 py-2">#{String(parcel._id || "").slice(-10).toUpperCase()}</td>
                      <td className="px-3 py-2">{parcel.amount.toFixed(2)}</td>
                      <td className="px-3 py-2">{parcel.createdAt.toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-right">
                        <MdMoreVert className="inline text-gray-500" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#262626]">Shipment Alerts</h2>
            <Link to="/dashboard/user/parcels" className="rounded-full bg-[#caeb66] px-3 py-1 text-[11px] font-medium text-[#1f1f1f]">View All Deliveries</Link>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-[#e0e0e0] bg-white p-3 text-center">
            <div>
              <p className="text-lg font-semibold text-[#1f1f1f]">{damagedCount}</p>
              <p className="text-[10px] text-gray-400">Damaged</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1f1f1f]">{weatherDelayCount}</p>
              <p className="text-[10px] text-gray-400">Weather Delays</p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-[#e0e0e0] bg-white p-2">
            {parcels.slice(0, 4).map((parcel, i) => (
              <div key={parcel._id || `alert-${i}`} className="flex items-center justify-between rounded-md border border-[#efefef] px-2 py-2">
                <div className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${parcel.normalizedStatus === "delivered" ? "bg-[#dff7e9] text-[#2d8f55]" : "bg-[#ffe6e6] text-[#d45d5d]"}`}>
                    <MdInfoOutline className="text-[12px]" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#1f1f1f]">{parcel.normalizedStatus.replace(/-/g, " ")}</p>
                    <p className="text-[10px] text-gray-400">Shipment #{String(parcel._id || "").slice(-8).toUpperCase()} - {parcel.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <MdArrowForward className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardHome;
