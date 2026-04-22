import React from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
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
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axiosSecure from "../../hooks/useAxiosSecure";

const DashboardOverview = () => {
  const navigate = useNavigate();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/admin/stats");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const { data: parcels = [], isLoading: parcelsLoading, isError } = useQuery({
    queryKey: ["admin-overview-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data || [];
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  });

  const rowsPerPage = 6;
  const [currentPage, setCurrentPage] = React.useState(1);

  const shippingRows = parcels
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .map((p) => ({
      id: `#${String(p._id || "").slice(-6).toUpperCase()}`,
      client: p.senderName || p.senderEmail || "N/A",
      date: new Date(p.createdAt || Date.now()).toLocaleDateString(),
      weight: `${Number(p.parcelWeight) || 0} kg`,
      shipper: p.parcelType === "document" ? "Document" : "Parcel",
      price: `${(Number(p.amount) || 0).toFixed(2)}`,
      status: String(p.status || "pending").toLowerCase(),
      parcelId: p._id,
    }));

  const totalPages = Math.max(1, Math.ceil(shippingRows.length / rowsPerPage));
  const paginatedRows = React.useMemo(() => {
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
    paid: "bg-[#ecf3ff] text-[#2f65d8]",
    shipped: "bg-[#eaf3ff] text-[#3063cc]",
    failed: "bg-[#ffe6e6] text-[#d45d5d]",
    damaged: "bg-[#ffe8df] text-[#d96f3f]",
  };

  const totals = statsData?.totals || {
    newPackages: 0,
    readyForShipping: 0,
    completed: 0,
    newClients: 0,
  };

  const stats = [
    { title: "New Packages", value: totals.newPackages.toLocaleString() },
    { title: "Ready for Shipping", value: totals.readyForShipping.toLocaleString() },
    { title: "Completed", value: totals.completed.toLocaleString() },
    { title: "New Clients", value: totals.newClients.toLocaleString() },
  ];

  const lateInvoices = parcels.filter((p) => String(p.paymentStatus || "unpaid").toLowerCase() !== "paid").slice(0, 6);

  const alerts = statsData?.alerts || { delayed: 0, failed: 0, damaged: 0 };
  const chartData = React.useMemo(() => {
    const source = Array.isArray(statsData?.chart) ? statsData.chart : [];
    const fallbackDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (!source.length) {
      return fallbackDays.map((day) => ({ day, parcels: 0, income: 0 }));
    }

    return source.map((item) => ({
      day: item?.day || "",
      parcels: Number(item?.parcels) || 0,
      income: Number(item?.income) || 0,
    }));
  }, [statsData?.chart]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#1f1f1f]">Dashboard Overview</h1>
          <p className="text-[11px] text-gray-500">You can access all your data and information from anywhere.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/send-parcel")}
          className="inline-flex items-center gap-1 rounded-lg bg-[#caeb66] px-3 py-2 text-xs font-semibold text-[#111] hover:bg-[#bedd5f]"
        >
          <MdAdd className="text-sm" />
          Create Shipment
        </button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.title} className="rounded-xl border border-[#e8e8e8] bg-[#f8f8f8] p-3">
            <div className="mb-1 flex items-center gap-2 text-[11px] text-gray-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#dddddd]">
                <MdLocalShipping className="text-[12px]" />
              </span>
              {item.title}
            </div>
            <p className="pl-7 text-[30px] font-semibold leading-none text-[#1f1f1f]">{statsLoading ? "..." : item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[#e4e4e4] bg-[#f7f7f7] p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#262626]">Shipment Statistics</h2>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#ecf5d2] px-3 py-1 text-xs font-semibold text-[#42521f]">Income</button>
            <button className="rounded-full border border-[#dddddd] bg-white px-3 py-1 text-xs text-gray-600">Packages</button>
            <button className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-3 py-1 text-xs text-gray-600">
              This Week
              <MdKeyboardArrowDown className="text-sm" />
            </button>
            <button className="rounded-full border border-[#dddddd] bg-white p-1.5 text-gray-500">
              <MdMoreVert className="text-sm" />
            </button>
          </div>
        </div>

        <div className="h-[260px] rounded-lg border border-[#e2e2e2] bg-white p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(value) => [`Tk ${Number(value).toFixed(2)}`, "Income"]} />
              <Line type="monotone" dataKey="income" stroke="#b8d94a" strokeWidth={3} dot={{ r: 4, fill: "#caeb66" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
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
                <th className="px-3 py-2 font-medium">Parcel ID</th>
                <th className="px-3 py-2 font-medium">Client Name</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Weight</th>
                <th className="px-3 py-2 font-medium">Shipper</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcelsLoading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">Loading shipping reports...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-red-500">Failed to load shipping reports.</td>
                </tr>
              ) : paginatedRows.length === 0 ? (
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
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/dashboard/parcels/${row.parcelId}`)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <MdEdit className="text-sm" /> View
                        </button>
                        <button onClick={() => navigate(`/dashboard/manage/${row.parcelId}`)} className="rounded bg-[#caeb66] px-2 py-1 text-[10px] font-semibold text-[#111]">
                          Manage
                        </button>
                      </div>
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
            <Link to="/dashboard/payments" className="rounded-full bg-[#caeb66] px-3 py-1 text-[11px] font-medium text-[#1f1f1f]">View All Invoices</Link>
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
                      <td className="px-3 py-2">{(Number(parcel.amount) || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">{new Date(parcel.createdAt || Date.now()).toLocaleDateString()}</td>
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
            <Link to="/dashboard/delivery" className="rounded-full bg-[#caeb66] px-3 py-1 text-[11px] font-medium text-[#1f1f1f]">View All alerts</Link>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg border border-[#e0e0e0] bg-white p-3 text-center">
            <div>
              <p className="text-lg font-semibold text-[#1f1f1f]">{alerts.damaged}</p>
              <p className="text-[10px] text-gray-400">Damaged</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1f1f1f]">{alerts.delayed}</p>
              <p className="text-[10px] text-gray-400">Delayed</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1f1f1f]">{alerts.failed}</p>
              <p className="text-[10px] text-gray-400">Failed</p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-[#e0e0e0] bg-white p-2">
            {[
              { title: "Damaged", count: alerts.damaged },
              { title: "Delayed", count: alerts.delayed },
              { title: "Failed", count: alerts.failed },
            ].map((alert) => (
              <div key={alert.title} className="flex items-center justify-between rounded-md border border-[#efefef] px-2 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe6e6] text-[#d45d5d]">
                    <MdInfoOutline className="text-[12px]" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#1f1f1f]">{alert.title}</p>
                    <p className="text-[10px] text-gray-400">{alert.count} shipment(s)</p>
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

export default DashboardOverview;
