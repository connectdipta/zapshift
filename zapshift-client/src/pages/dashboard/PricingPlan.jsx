import React, { useState } from "react";
import warehouses from "../../assets/warehouses.json";

const PricingPlan = () => {
  const [parcelType, setParcelType] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const districtMap = warehouses.reduce((map, warehouse) => {
    if (!map[warehouse.district]) {
      map[warehouse.district] = {
        name: warehouse.district,
        isWithinCity: warehouse.district === "Dhaka",
      };
    }
    return map;
  }, {});

  const districtOptions = Object.entries(districtMap).sort((a, b) => a[0].localeCompare(b[0]));

  const handleCalculate = () => {
    if (!parcelType || !origin || !destination || !weight) {
      setCalculatedPrice(null);
      return;
    }

    const weightValue = parseFloat(weight);
    const isWithinCity = districtMap[destination]?.isWithinCity;
    let totalPrice = 0;

    if (parcelType === "document") {
      totalPrice = isWithinCity ? 60 : 80;
    } else if (parcelType === "non-document") {
      if (weightValue <= 3) {
        totalPrice = isWithinCity ? 110 : 150;
      } else {
        totalPrice = weightValue * 40 + (isWithinCity ? 0 : 40);
      }
    }

    setCalculatedPrice(Math.round(totalPrice));
  };

  const handleReset = () => {
    setParcelType("");
    setOrigin("");
    setDestination("");
    setWeight("");
    setCalculatedPrice(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Plan</h1>
        <p className="mt-2 text-gray-600">Use the calculator below to estimate parcel delivery cost.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Calculate Your Cost</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Parcel Type</label>
              <select value={parcelType} onChange={(e) => setParcelType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-[var(--color-primary)] focus:outline-none">
                <option value="">Select Parcel Type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-Document</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">From</label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-[var(--color-primary)] focus:outline-none">
                  <option value="">Select Origin</option>
                  {districtOptions.map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">To</label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-[var(--color-primary)] focus:outline-none">
                  <option value="">Select Destination</option>
                  {districtOptions.map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Weight (kg)</label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="Enter weight" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-[var(--color-primary)] focus:outline-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleReset} type="button" className="flex-1 rounded-lg border border-[var(--color-primary)] px-4 py-3 font-semibold text-[var(--color-primary)] hover:bg-gray-50">Reset</button>
              <button onClick={handleCalculate} type="button" className="flex-1 rounded-lg px-4 py-3 font-semibold text-[#111] hover:brightness-95" style={{ backgroundColor: "var(--color-primary)" }}>Calculate</button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-center">
          {calculatedPrice !== null ? (
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-4">Estimated Delivery Cost</p>
              <div className="text-7xl font-black text-gray-900">
                {calculatedPrice}<span className="text-3xl"> Tk</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">Inclusive of all charges</p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="mb-3 text-7xl font-light">৳</div>
              <p>Select options and calculate</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Pricing Structure</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-700">
                <th className="py-3 pr-4">Parcel Type</th>
                <th className="py-3 pr-4">Weight</th>
                <th className="py-3 pr-4">Within City</th>
                <th className="py-3 pr-4">Outside City</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-semibold text-gray-900">Document</td>
                <td className="py-3 pr-4 text-gray-600">Any</td>
                <td className="py-3 pr-4">৳60</td>
                <td className="py-3 pr-4">৳80</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-semibold text-gray-900">Non-Document</td>
                <td className="py-3 pr-4 text-gray-600">Up to 3kg</td>
                <td className="py-3 pr-4">৳110</td>
                <td className="py-3 pr-4">৳150</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-gray-900">Non-Document</td>
                <td className="py-3 pr-4 text-gray-600">Over 3kg</td>
                <td className="py-3 pr-4">+৳40/kg</td>
                <td className="py-3 pr-4">+৳40/kg +৳40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;
