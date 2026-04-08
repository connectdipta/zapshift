import React, { useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer'
import warehouses from '../assets/warehouses.json'

const Pricing = () => {
  const [parcelType, setParcelType] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [weight, setWeight] = useState('')
  const [calculatedPrice, setCalculatedPrice] = useState(null)

  const parcelTypes = {
    'document': { name: 'Document', type: 'document' },
    'non-document': { name: 'Non-Document', type: 'non-document' },
  }

  const districtMap = warehouses.reduce((map, warehouse) => {
    if (!map[warehouse.district]) {
      map[warehouse.district] = {
        name: warehouse.district,
        region: warehouse.region,
        isWithinCity: warehouse.district === 'Dhaka',
      }
    }
    return map
  }, {})

  const districtOptions = Object.entries(districtMap).sort((a, b) => a[0].localeCompare(b[0]))

  const handleCalculate = () => {
    if (!parcelType || !origin || !destination || !weight) {
      alert('Please fill in all fields')
      return
    }

    const weightValue = parseFloat(weight)
    const isWithinCity = districtMap[destination]?.isWithinCity
    let totalPrice = 0

    if (parcelType === 'document') {
      totalPrice = isWithinCity ? 60 : 80
    } else if (parcelType === 'non-document') {
      if (weightValue <= 3) {
        totalPrice = isWithinCity ? 110 : 150
      } else {
        totalPrice = weightValue * 40
        if (!isWithinCity) {
          totalPrice += 40
        }
      }
    }

    setCalculatedPrice(Math.round(totalPrice))
  }

  const handleReset = () => {
    setParcelType('')
    setOrigin('')
    setDestination('')
    setWeight('')
    setCalculatedPrice(null)
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl p-10 pt-2 shadow-2xl">
      <div className="">
        {/* Header */}
        <div className="py-12 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Pricing Calculator</h1>
          <p className="text-gray-600 max-w-2xl">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Calculator Section */}
        <div className="py-12 px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side - Inputs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Calculate Your Cost</h2>

              <div className="space-y-6">
                {/* Parcel Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Parcel type</label>
                  <select
                    value={parcelType}
                    onChange={(e) => setParcelType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                  >
                    <option value="">Select Parcel type</option>
                    {Object.entries(parcelTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                </div>

                {/* From / To Destination */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                    >
                      <option value="">Select Origin</option>
                      {districtOptions.map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white text-gray-700 cursor-pointer"
                    >
                      <option value="">Select Destination</option>
                      {districtOptions.map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Compact"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-gray-700"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleCalculate}
                    className="flex-1 px-6 py-3 rounded-lg text-gray-900 font-semibold transition hover:brightness-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - Price Display */}
            <div className="flex items-center justify-center min-h-[300px]">
              {calculatedPrice !== null ? (
                <div className="text-center">
                  <p className="text-gray-600 text-lg mb-6">Estimated Delivery Cost</p>
                  <div className="text-8xl font-black text-gray-900">
                    {calculatedPrice}
                    <span className="text-4xl"> Tk</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-6">Inclusive of all charges</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-7xl font-light text-gray-300 mb-4">৳</div>
                  <p className="text-gray-400">Select options and calculate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="border-t border-gray-200 py-12 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pricing Structure</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-3 font-semibold text-gray-900">Parcel Type</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Weight</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Within City</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Outside City</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-semibold">Document</td>
                  <td className="px-6 py-4 text-gray-600">Any</td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">৳60</td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">৳80</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-semibold">Non-Document</td>
                  <td className="px-6 py-4 text-gray-600">Up to 3kg</td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">৳110</td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">৳150</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-semibold">Non-Document</td>
                  <td className="px-6 py-4 text-gray-600">&gt;3kg</td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">+৳40/kg</td>
                  <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">+৳40/kg +৳40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
