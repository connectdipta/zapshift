import React from "react";
import { Link, useParams } from "react-router";
import { MdArrowBack } from "react-icons/md";
import useParcelById from "../../hooks/useParcelById";

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[90px_1fr] gap-3 text-[11px] text-gray-600">
    <p className="font-medium text-gray-500">{label}</p>
    <p>{value || "N/A"}</p>
  </div>
);

const Card = ({ title, children }) => (
  <section className="rounded-xl bg-[#f7f7f7] p-4">
    <h2 className="mb-3 text-[28px] font-semibold text-[#0b3b46] sm:text-xl">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

const ParcelView = () => {
  const { id } = useParams();
  const { data: parcel, isLoading, isError } = useParcelById(id);

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-8 text-sm text-gray-600 shadow-sm">Loading parcel details...</div>;
  }

  if (isError || !parcel) {
    return (
      <div className="rounded-2xl bg-white p-8 text-sm text-red-500 shadow-sm">
        Parcel details not found.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-[#0b3b46]">Parcel Details</h1>
        <Link
          to="/dashboard/parcels"
          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <MdArrowBack /> Back
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Sender Info">
          <InfoRow label="Name" value={parcel.senderName} />
          <InfoRow label="Phone" value={parcel.senderPhone} />
          <InfoRow label="Email" value={parcel.senderEmail} />
          <InfoRow label="Region" value={parcel.senderRegion} />
          <InfoRow label="Address" value={parcel.senderAddress} />
        </Card>

        <Card title="Receiver Info">
          <InfoRow label="Name" value={parcel.receiverName} />
          <InfoRow label="Phone" value={parcel.receiverPhone} />
          <InfoRow label="Email" value={parcel.receiverEmail} />
          <InfoRow label="Region" value={parcel.receiverRegion} />
          <InfoRow label="Address" value={parcel.receiverAddress} />
        </Card>

        <Card title="Parcel details">
          <InfoRow label="Title" value={parcel.parcelName} />
          <InfoRow label="Type" value={parcel.parcelType} />
          <InfoRow label="Weight" value={`${parcel.parcelWeight || 0} KG`} />
          <InfoRow label="Charge" value={`Tk ${parcel.amount || 0}`} />
          <InfoRow label="Status" value={parcel.normalizedStatus} />
          <InfoRow label="Pickup Instruction" value={parcel.pickupInstruction} />
          <InfoRow label="Delivery Instruction" value={parcel.deliveryInstruction} />
          <InfoRow label="Tracking Number" value={String(parcel._id || "").slice(-6).toUpperCase()} />
          <InfoRow label="Pickup OTP" value={String(parcel._id || "").slice(-4)} />
          <InfoRow label="Delivery OTP" value={String(parcel._id || "").slice(-5, -1)} />
        </Card>
      </div>
    </div>
  );
};

export default ParcelView;
