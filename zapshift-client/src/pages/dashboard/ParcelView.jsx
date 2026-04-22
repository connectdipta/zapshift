import React from "react";
import { useNavigate, useParams } from "react-router";
import { MdArrowBack, MdOutlineQrCodeScanner, MdOutlineInventory2, MdOutlinePersonPinCircle, MdOutlineReceiptLong, MdInfoOutline } from "react-icons/md";
import useParcelById from "../../hooks/useParcelById";

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-50 last:border-0">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-[#103d45] mt-1 sm:mt-0">{value || "N/A"}</p>
  </div>
);

const DetailCard = ({ title, icon: Icon, children }) => (
  <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50 text-[#103d45]">
          <Icon className="text-xl" />
       </div>
       <h2 className="text-xl font-black text-[#103d45]">{title}</h2>
    </div>
    <div className="flex-1 space-y-1">{children}</div>
  </section>
);

const ParcelView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: parcel, isLoading, isError } = useParcelById(id);

  if (isLoading) return <div className="rounded-3xl bg-white p-16 text-center text-gray-400 shadow-sm animate-pulse">Synchronizing parcel data...</div>;
  if (isError || !parcel) return <div className="rounded-3xl bg-white p-16 text-center text-rose-500 shadow-sm font-bold border border-rose-100">Parcel record unavailable.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <div className="inline-flex items-center gap-2 rounded-full bg-lime-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-lime-600 mb-2">
              <MdOutlineQrCodeScanner /> Secure Record
           </div>
           <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Parcel Manifest</h1>
           <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{String(id).slice(-12).toUpperCase()}</p>
        </div>
        <button onClick={() => navigate(-1)} className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"><MdArrowBack /> Back</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DetailCard title="Shipment Core" icon={MdOutlineInventory2}>
           <InfoRow label="Title" value={parcel.parcelName} />
           <InfoRow label="Classification" value={parcel.parcelType} />
           <InfoRow label="Net Weight" value={`${parcel.parcelWeight || 0} KG`} />
           <InfoRow label="Base Charge" value={`Tk ${parcel.amount || 0}`} />
           <InfoRow label="Network ID" value={parcel.trackingNo || "PENDING"} />
        </DetailCard>

        <DetailCard title="Origin Data" icon={MdOutlinePersonPinCircle}>
           <InfoRow label="Consignor" value={parcel.senderName} />
           <InfoRow label="Contact" value={parcel.senderPhone} />
           <InfoRow label="Email" value={parcel.senderEmail} />
           <InfoRow label="Region" value={parcel.senderRegion} />
           <div className="py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Address</p>
              <p className="text-xs font-bold text-[#103d45] mt-2 leading-relaxed">{parcel.senderAddress}</p>
           </div>
        </DetailCard>

        <DetailCard title="Destination Data" icon={MdOutlinePersonPinCircle}>
           <InfoRow label="Consignee" value={parcel.receiverName} />
           <InfoRow label="Contact" value={parcel.receiverPhone} />
           <div className="py-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Address</p>
              <p className="text-xs font-bold text-[#103d45] mt-2 leading-relaxed">{parcel.receiverAddress}</p>
           </div>
           <InfoRow label="Delivery Region" value={parcel.receiverRegion} />
        </DetailCard>

        <DetailCard title="System Workflow" icon={MdOutlineReceiptLong}>
           <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 mb-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Lifecycle Status</p>
              <p className="text-base font-black text-[#103d45] mt-1 uppercase tracking-tight">{String(parcel.status || "pending").replace(/-/g, " ")}</p>
           </div>
           <InfoRow label="Pickup OTP" value={String(parcel._id || "").slice(-4)} />
           <InfoRow label="Delivery OTP" value={String(parcel._id || "").slice(-5, -1)} />
        </DetailCard>

        <DetailCard title="Handling Instructions" icon={MdInfoOutline}>
           <div className="space-y-4">
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup Logic</p>
                 <p className="text-xs font-medium text-gray-500 leading-relaxed italic">{parcel.pickupInstruction || "No special handling required for pickup."}</p>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Final Handover Logic</p>
                 <p className="text-xs font-medium text-gray-500 leading-relaxed italic">{parcel.deliveryInstruction || "No special handling required for delivery."}</p>
              </div>
           </div>
        </DetailCard>
      </div>
    </div>
  );
};

export default ParcelView;
