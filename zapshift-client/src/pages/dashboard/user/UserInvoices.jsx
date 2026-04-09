import React from "react";
import { MdDownload, MdReceiptLong } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import jsPDF from "jspdf";
import useUserParcels from "../../../hooks/useUserParcels";

const UserInvoices = () => {
  const { parcels, isLoading, isError } = useUserParcels();

  const invoices = parcels
    .filter((parcel) => parcel.paymentStatus === "paid")
    .slice()
    .sort((a, b) => b.paidAt - a.paidAt)
    .map((parcel) => ({
      id: `INV-${String(parcel._id || "").slice(-6).toUpperCase()}`,
      parcelId: String(parcel._id || "").slice(-8).toUpperCase(),
      amount: parcel.amount,
      date: parcel.paidAt || parcel.createdAt,
      status: "Paid",
    }));

  const downloadInvoice = (invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ZapShift Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 20, 40);
    doc.text(`Parcel ID: ${invoice.parcelId}`, 20, 50);
    doc.text(`Amount: ৳${invoice.amount}`, 20, 60);
    doc.text(`Status: Paid`, 20, 70);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 80);

    doc.save(`${invoice.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MdReceiptLong />
          Invoices
        </h1>
        <p className="text-gray-600 mt-2">View and download paid parcel invoices.</p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-red-500">Failed to load invoices.</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-600">No paid invoices yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-sm hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Parcel ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-semibold">{invoice.id}</td>
                      <td className="py-3 px-4 text-gray-600">{invoice.parcelId}</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">Tk {invoice.amount}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => downloadInvoice(invoice)}
                          className="text-[var(--color-primary)] hover:underline font-semibold text-sm flex items-center gap-1"
                        >
                          <MdDownload />
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 md:hidden">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-gray-900">{invoice.id}</p>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <IoCheckmarkCircle className="w-3 h-3" />
                    Paid
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Parcel: {invoice.parcelId}</p>
                <p className="text-sm text-gray-600 mb-3">{new Date(invoice.date).toLocaleDateString()} • <span className="font-semibold">Tk {invoice.amount}</span></p>
                <button
                  onClick={() => downloadInvoice(invoice)}
                  className="w-full text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg py-2 font-semibold text-sm hover:bg-[var(--color-primary)] hover:text-black transition flex items-center justify-center gap-2"
                >
                  <MdDownload />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserInvoices;
