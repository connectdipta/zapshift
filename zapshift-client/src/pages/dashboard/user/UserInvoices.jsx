import React from "react";
import { MdDownload, MdReceiptLong, MdOutlineLocalPrintshop } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import jsPDF from "jspdf";
import useUserParcels from "../../../hooks/useUserParcels";
import useAuth from "../../../hooks/useAuth";
import logoImage from "../../../assets/logo.png";

const UserInvoices = () => {
  const { user } = useAuth();
  const { parcels, isLoading, isError } = useUserParcels();

  const invoices = parcels
    .filter((parcel) => parcel.paymentStatus === "paid")
    .slice()
    .sort((a, b) => (b.paidAt || b.createdAt) - (a.paidAt || a.createdAt))
    .map((parcel) => ({
      id: `INV-${String(parcel._id || "").slice(-6).toUpperCase()}`,
      parcelId: String(parcel._id || "").slice(-8).toUpperCase(),
      amount: parcel.amount,
      date: parcel.paidAt || parcel.createdAt,
      status: "Paid",
      parcel: parcel,
    }));

  const downloadInvoice = (invoice) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const darkBlue = "#103d45";
    const brandLime = "#b8d94a";
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(16, 61, 69);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, "bold");
    doc.text("INVOICE", 20, 32);

    try {
      doc.addImage(logoImage, "PNG", pageWidth - 40, 15, 20, 20);
    } catch (e) {
      doc.setTextColor(184, 217, 74);
      doc.setFontSize(20);
      doc.text("ZapShift", pageWidth - 45, 28);
    }

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("BILLED TO:", 20, 65);
    doc.setFont(undefined, "normal");
    doc.text(user?.displayName || "Valued Client", 20, 72);
    doc.text(user?.email || "N/A", 20, 78);

    doc.setFont(undefined, "bold");
    doc.text("INVOICE SUMMARY:", 120, 65);
    doc.setFont(undefined, "normal");
    doc.text(`Invoice ID: ${invoice.id}`, 120, 72);
    doc.text(`Parcel ID: ${invoice.parcelId}`, 120, 78);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 120, 84);

    doc.setFillColor(16, 61, 69);
    doc.rect(20, 95, 170, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("DESCRIPTION", 25, 101.5);
    doc.text("AMOUNT", 160, 101.5);

    doc.setTextColor(51, 51, 51);
    doc.setFont(undefined, "normal");
    doc.text(`Standard Delivery Service (${invoice.parcel?.parcelWeight}kg)`, 25, 115);
    doc.text(`Tk ${invoice.amount}`, 160, 115);

    doc.setFillColor(250, 250, 250);
    doc.rect(120, 130, 70, 30, "F");
    doc.setFontSize(9);
    doc.text("Subtotal:", 130, 138);
    doc.text(`Tk ${invoice.amount}`, 165, 138);
    doc.text("Tax (0%):", 130, 145);
    doc.text("Tk 0.00", 165, 145);

    doc.setFillColor(16, 61, 69);
    doc.rect(120, 152, 70, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.setFontSize(11);
    doc.text("TOTAL PAID", 125, 158.5);
    doc.text(`Tk ${invoice.amount}`, 165, 158.5);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("This is a system generated invoice and requires no signature.", pageWidth / 2, pageHeight - 15, { align: "center" });

    doc.save(`${invoice.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">Access your historical payment records and receipts.</p>
        </div>
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
           <MdReceiptLong className="text-gray-400 text-xl" />
           <span className="text-xl font-black text-[#103d45]">{invoices.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse rounded-3xl bg-gray-100" />)}
        </div>
      ) : isError ? (
        <div className="rounded-3xl bg-white p-12 text-center text-rose-500 shadow-sm font-bold border border-rose-100">Synchronized data unavailable.</div>
      ) : invoices.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
            <MdReceiptLong className="text-4xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No invoices yet</h3>
          <p className="mt-2 text-sm text-gray-500">Invoices are generated automatically after a successful payment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-5 transition hover:shadow-md">
              <div className="flex justify-between items-start">
                 <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{invoice.id}</p>
                    <h3 className="text-lg font-black text-[#103d45]">Tk {invoice.amount}</h3>
                 </div>
                 <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[9px] font-black uppercase text-emerald-600 tracking-tighter flex items-center gap-1">
                    <IoCheckmarkCircle className="text-xs" />
                    {invoice.status}
                 </span>
              </div>

              <div className="space-y-2 py-3 border-y border-gray-50">
                 <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Parcel ID</span>
                    <span className="text-gray-600">#{invoice.parcelId}</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Issued</span>
                    <span className="text-gray-600">{new Date(invoice.date).toLocaleDateString()}</span>
                 </div>
              </div>

              <button
                onClick={() => downloadInvoice(invoice)}
                className="w-full rounded-2xl bg-[#103d45] py-3 text-xs font-black text-white shadow-sm transition hover:brightness-125 flex items-center justify-center gap-2"
              >
                <MdDownload className="text-lg" />
                Download Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInvoices;
