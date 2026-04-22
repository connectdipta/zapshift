import React, { useState } from "react";
import warehouses from "../../assets/warehouses.json";
import { MdCalculate, MdRestartAlt, MdTableChart, MdArrowForward } from "react-icons/md";

const PricingPlan = () => {
  const [parcelType, setParcelType] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const districtMap = warehouses.reduce((map, warehouse) => {
    if (!map[warehouse.district]) {
      map[warehouse.district] = { name: warehouse.district, isWithinCity: warehouse.district === "Dhaka" };
    }
    return map;
  }, {});

  const districtOptions = Object.entries(districtMap).sort((a, b) => a[0].localeCompare(b[0]));

  const handleCalculate = () => {
    if (!parcelType || !origin || !destination || !weight) return;
    const weightValue = parseFloat(weight);
    const isWithinCity = districtMap[destination]?.isWithinCity;
    let totalPrice = 0;
    if (parcelType === "document") {
      totalPrice = isWithinCity ? 60 : 80;
    } else if (parcelType === "non-document") {
      if (weightValue <= 3) totalPrice = isWithinCity ? 110 : 150;
      else totalPrice = weightValue * 40 + (isWithinCity ? 0 : 40);
    }
    setCalculatedPrice(Math.round(totalPrice));
  };

  const handleReset = () => {
    setParcelType(""); setOrigin(""); setDestination(""); setWeight(""); setCalculatedPrice(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103d45]">Tariff & Calculator</h1>
          <p className="mt-1 text-sm text-gray-500">Estimate shipment costs based on weight and destination.</p>
        </div>
        <div className="bg-[#103d45] px-5 py-3 rounded-2xl flex items-center gap-2 text-white shadow-lg shadow-teal-900/10">
           <MdCalculate className="text-lime-400 text-xl" />
           <span className="text-xs font-bold uppercase tracking-widest">Rate Engine v2</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-gray-100">
          <h2 className="mb-6 text-xl font-bold text-[#103d45] flex items-center gap-2"><MdCalculate className="text-[#b8d94a]"/> Cost Calculator</h2>
          <div className="grid gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Parcel Category</label>
              <select value={parcelType} onChange={(e) => setParcelType(e.target.value)} className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition focus:border-[#b8d94a] focus:bg-white">
                <option value="">Choose Category</option>
                <option value="document">Document (Papers/Legal)</option>
                <option value="non-document">Non-Document (Items/Boxes)</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin District</label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#103d45] outline-none">
                  <option value="">Select Origin</option>
                  {districtOptions.map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Destination District</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#103d45] outline-none">
                  <option value="">Select Destination</option>
                  {districtOptions.map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Approx Weight (KG)</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="Enter kg" className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition focus:border-[#b8d94a]" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button onClick={handleCalculate} className="flex-[2] rounded-2xl bg-[#caeb66] py-4 text-sm font-black text-[#1c2d1a] shadow-lg shadow-lime-100 transition hover:brightness-95">Estimate Price</button>
              <button onClick={handleReset} className="flex-1 rounded-2xl border border-gray-100 bg-white py-4 text-xs font-bold text-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2"><MdRestartAlt /> Reset</button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[#103d45] p-10 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><MdCalculate className="text-9xl" /></div>
           {calculatedPrice !== null ? (
            <div className="animate-in fade-in zoom-in duration-300">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Estimated Total</p>
              <h2 className="text-7xl font-black text-[#b8d94a] flex items-baseline gap-2">
                {calculatedPrice}<span className="text-xl text-white/50">Tk</span>
              </h2>
              <div className="mt-8 flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-[10px] font-bold text-white/60">
                 <MdArrowForward className="text-[#b8d94a]" /> Includes all regional charges
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-[#b8d94a] text-4xl font-black italic">৳</div>
              <p className="text-sm font-medium text-white/30 max-w-[180px]">Complete the form to generate a dynamic rate quote</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 border border-gray-100">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#103d45]"><MdTableChart className="text-[#b8d94a]"/> Global Rate Matrix</h2>
        <div className="grid gap-4 sm:grid-cols-3">
           {[
             { type: "Document", weight: "Any Weight", city: "৳60", outside: "৳80" },
             { type: "Non-Doc", weight: "Up to 3kg", city: "৳110", outside: "৳150" },
             { type: "Non-Doc", weight: "Over 3kg", city: "+৳40/kg", outside: "+৳40/kg +৳40" }
           ].map((row, i) => (
             <div key={i} className="rounded-2xl bg-gray-50 p-5 border border-gray-100 transition hover:bg-white hover:shadow-md">
                <p className="text-[9px] font-black uppercase tracking-widest text-lime-600 mb-2">{row.type}</p>
                <p className="text-sm font-black text-[#103d45] mb-4">{row.weight}</p>
                <div className="space-y-2 border-t border-gray-200/50 pt-3">
                   <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400">Within City</span><span className="text-[#103d45]">{row.city}</span></div>
                   <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400">Inter-District</span><span className="text-[#103d45]">{row.outside}</span></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;
