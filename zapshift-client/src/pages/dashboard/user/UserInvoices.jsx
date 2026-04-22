import React from "react";
import { MdDownload, MdReceiptLong } from "react-icons/md";
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
    .sort((a, b) => b.paidAt - a.paidAt)
    .map((parcel) => ({
      id: `INV-${String(parcel._id || "").slice(-6).toUpperCase()}`,
      parcelId: String(parcel._id || "").slice(-8).toUpperCase(),
      amount: parcel.amount,
      date: parcel.paidAt || parcel.createdAt,
      status: "Paid",
      parcel: parcel,
    }));

  const downloadInvoice = (invoice) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Colors
    const darkBlue = "#1e3a5f";
    const lightGray = "#f5f5f5";
    const darkGray = "#333333";

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== HEADER SECTION =====
    // Dark blue header background
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, pageWidth, 50, "F");

    // Invoice title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, "bold");
    doc.text("INVOICE", 20, 25);

    // Company logo - Fixed dimensions to prevent scaling issues
    try {
      const logoWidth = 20;
      const logoHeight = 20;
      const logoX = pageWidth - 30;
      const logoY = 12;
      doc.addImage(logoImage, "PNG", logoX, logoY, logoWidth, logoHeight);
    } catch (e) {
      // Fallback if logo fails to load
      doc.setFillColor(255, 255, 255);
      doc.rect(pageWidth - 30, 12, 20, 20, "F");
      doc.setTextColor(30, 58, 95);
      doc.setFontSize(7);
      doc.setFont(undefined, "bold");
      doc.text("ZS", pageWidth - 20, 26, { align: "center" });
    }

    // ===== BILLED TO SECTION =====
    doc.setTextColor(darkGray);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("BILLED TO:", 20, 60);

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    const customerName = user?.displayName || invoice.parcel?.senderName || "Customer";
    const senderEmail = user?.email || "N/A";
    const senderPhone = invoice.parcel?.senderPhone || "N/A";
    
    doc.text(customerName, 20, 68);
    doc.text(senderEmail, 20, 74);
    doc.text(senderPhone, 20, 80);

    // ===== INVOICE DETAILS SECTION =====
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.text("INVOICE DETAILS:", 120, 60);

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.text(`Invoice ID: ${invoice.id}`, 120, 68);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 120, 74);
    doc.text(`Due Date: ${new Date(invoice.date).toLocaleDateString()}`, 120, 80);

    // ===== INVOICE TABLE =====
    const tableStartY = 95;

    // Table header background
    doc.setFillColor(30, 58, 95);
    doc.rect(20, tableStartY, 170, 8, "F");

    // Table headers
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    doc.text("DESCRIPTION", 25, tableStartY + 6);
    doc.text("QTY", 120, tableStartY + 6);
    doc.text("RATE", 140, tableStartY + 6);
    doc.text("AMOUNT", 160, tableStartY + 6);

    // Table rows
    doc.setTextColor(darkGray);
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);

    const parcelDescription = `Parcel to ${invoice.parcel?.receiverName || "Recipient"} (${invoice.parcel?.parcelWeight || 0}kg)`;
    doc.text(parcelDescription, 25, tableStartY + 16);
    doc.text("1", 120, tableStartY + 16);
    doc.text(`Tk ${invoice.amount}`, 140, tableStartY + 16);
    doc.text(`Tk ${invoice.amount}`, 160, tableStartY + 16);

    // ===== TOTALS SECTION =====
    const totalsY = tableStartY + 35;

    // Light gray background for totals
    doc.setFillColor(245, 245, 245);
    doc.rect(120, totalsY - 5, 70, 30, "F");

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.text("Subtotal:", 130, totalsY + 3);
    doc.text(`Tk ${invoice.amount}`, 160, totalsY + 3);

    doc.text("Discount:", 130, totalsY + 10);
    doc.text("Tk 0.00", 160, totalsY + 10);

    doc.text("Tax:", 130, totalsY + 17);
    doc.text("Tk 0.00", 160, totalsY + 17);

    // Total line
    doc.setFont(undefined, "bold");
    doc.setFontSize(11);
    doc.setFillColor(30, 58, 95);
    doc.rect(120, totalsY + 24, 70, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL:", 130, totalsY + 28);
    doc.text(`Tk ${invoice.amount}`, 160, totalsY + 28);

    // ===== TERMS & CONDITIONS =====
    doc.setTextColor(darkGray);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    const termsY = totalsY + 45;
    doc.text("TERMS & CONDITIONS:", 20, termsY);

    doc.setFont(undefined, "normal");
    doc.setFontSize(8);
    doc.text("Payment must be made within 30 days of invoice date.", 20, termsY + 8);
    doc.text("Thank you for your business!", 20, termsY + 14);

    // ===== FOOTER =====
    doc.setFillColor(30, 58, 95);
    doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text("ZapShift Delivery Services", 20, pageHeight - 17);

    doc.setFont(undefined, "normal");
    doc.text("Email: support@zapshift.com | Phone: +1 800-DISPATCH", 20, pageHeight - 12);
    doc.text("www.zapshift.com", 20, pageHeight - 7);

    // Parcel ID in footer
    doc.text(`Parcel ID: ${invoice.parcelId}`, pageWidth - 30, pageHeight - 7, { align: "right" });

    // ===== PAGE NUMBER =====
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page 1 of 1`, pageWidth / 2, pageHeight - 3, { align: "center" });

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
