import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import warehouses from '../../assets/warehouses.json'
import { 
  MdCalculate, MdOutlineLocalShipping, MdHistoryEdu, MdSettingsSuggest, 
  MdCheckCircle, MdArrowForward, MdInfoOutline, MdLocationOn,
  MdOutlineInventory2, MdSpeed, MdShield, MdSavings, MdArrowDropDown
} from 'react-icons/md'
import { useNavigate } from 'react-router'

const Pricing = () => {
  const navigate = useNavigate();
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

  const inputClasses = "w-full rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition-all placeholder:text-gray-300 focus:border-[#caeb66] focus:ring-4 focus:ring-lime-50/50 hover:border-gray-200 shadow-sm";
  const selectClasses = "w-full appearance-none rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-bold text-[#103d45] outline-none transition-all focus:border-[#caeb66] focus:ring-4 focus:ring-lime-50/50 hover:border-gray-200 shadow-sm cursor-pointer";

  return (
    <div className="min-h-screen bg-[#fcfdf2] selection:bg-[#103d45] selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden bg-[#103d45]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#caeb66]/5 rounded-full -mr-64 -mt-64 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-lime-400 mb-8 border border-lime-400/20"
          >
            <MdCalculate className="text-lg" /> Transparent Pricing Grid
          </motion.div>
          <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8">
            Simple rates for <br/> <span className="text-[#caeb66]">complex logistics.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/50 font-medium leading-relaxed">
            No hidden fees. No complicated formulas. Just clear, affordable pricing for every district in Bangladesh.
          </p>
        </div>
      </section>

      {/* Calculator Interface */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 lg:-mt-32 relative z-20 pb-20">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-black/10 overflow-hidden lg:flex">
          {/* Form Side */}
          <div className="lg:w-1/2 p-8 lg:p-16 border-r border-gray-50">
             <div className="mb-12">
                <h3 className="text-3xl font-black text-[#103d45] mb-2">Cost Estimator</h3>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Calculate your shipment budget in seconds</p>
             </div>

             <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Parcel Type</label>
                   <div className="relative">
                      <select value={parcelType} onChange={(e) => setParcelType(e.target.value)} className={selectClasses}>
                         <option value="">Select Category</option>
                         {Object.entries(parcelTypes).map(([key, value]) => (
                           <option key={key} value={key}>{value.name}</option>
                         ))}
                      </select>
                      <MdArrowDropDown className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Origin</label>
                      <div className="relative">
                         <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={selectClasses}>
                            <option value="">Source Hub</option>
                            {districtOptions.map(([key, value]) => (
                              <option key={key} value={key}>{value.name}</option>
                            ))}
                         </select>
                         <MdArrowDropDown className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Destination</label>
                      <div className="relative">
                         <select value={destination} onChange={(e) => setDestination(e.target.value)} className={selectClasses}>
                            <option value="">Target Hub</option>
                            {districtOptions.map(([key, value]) => (
                              <option key={key} value={key}>{value.name}</option>
                            ))}
                         </select>
                         <MdArrowDropDown className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none" />
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Total Weight (KG)</label>
                   <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.5" className={inputClasses} />
                </div>

                <div className="flex gap-4 pt-4">
                   <button onClick={handleReset} className="flex-1 py-6 px-8 rounded-3xl border-2 border-gray-100 font-black text-sm text-gray-400 hover:border-gray-200 transition-all">
                      Reset
                   </button>
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={handleCalculate}
                     className="flex-[2] py-6 px-10 rounded-3xl bg-[#caeb66] font-black text-sm text-[#103d45] shadow-2xl shadow-lime-100 transition-all flex items-center justify-center gap-3"
                   >
                      Calculate Price <MdArrowForward className="text-xl" />
                   </motion.button>
                </div>
             </div>
          </div>

          {/* Result Side */}
          <div className="lg:w-1/2 bg-gray-50/50 p-8 lg:p-20 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full -mr-32 -mt-32 blur-3xl" />
             
             <AnimatePresence mode="wait">
                {calculatedPrice !== null ? (
                   <motion.div 
                     key="result"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="text-center relative z-10"
                   >
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Estimated Delivery Cost</p>
                      <div className="flex items-end justify-center gap-2 mb-12">
                         <span className="text-8xl lg:text-9xl font-black text-[#103d45] leading-none">{calculatedPrice}</span>
                         <span className="text-4xl font-black text-gray-300 mb-4 tracking-tight">BDT</span>
                      </div>
                      
                      <div className="p-8 rounded-[3rem] bg-white shadow-xl shadow-black/5 inline-flex items-center gap-4 border border-gray-100">
                         <div className="h-12 w-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#103d45]">
                            <MdCheckCircle className="text-2xl" />
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-black text-[#103d45]">Instant Quote Verified</p>
                            <p className="text-[10px] font-bold text-gray-400">Includes all regional transit taxes & fuels</p>
                         </div>
                      </div>
                   </motion.div>
                ) : (
                   <motion.div 
                     key="empty"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-center relative z-10"
                   >
                      <div className="h-32 w-32 rounded-[2.5rem] bg-white shadow-inner flex items-center justify-center mx-auto mb-8 border border-gray-100">
                         <MdCalculate className="text-6xl text-gray-200" />
                      </div>
                      <h4 className="text-xl font-black text-[#103d45] mb-4">Ready to Calculate?</h4>
                      <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">Input your shipment details on the left to get a real-time price estimation.</p>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Pricing Matrix Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                 <div className="h-10 w-10 rounded-2xl bg-[#103d45] flex items-center justify-center text-[#caeb66]">
                    <MdHistoryEdu className="text-2xl" />
                 </div>
                 <h2 className="text-3xl font-black text-[#103d45]">Service Matrix</h2>
              </div>

              <div className="bg-gray-50/50 rounded-[3rem] border border-gray-100 overflow-hidden shadow-inner">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-gray-100">
                          <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                          <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Weight Bracket</th>
                          <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Inside City</th>
                          <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Outside City</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-black text-[#103d45]">
                       <tr className="hover:bg-white transition-colors group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-sm tracking-tight">Document</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-xs text-gray-400">Any Weight</td>
                          <td className="px-10 py-8 text-right text-xl">৳60</td>
                          <td className="px-10 py-8 text-right text-xl">৳80</td>
                       </tr>
                       <tr className="hover:bg-white transition-colors group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <span className="h-2 w-2 rounded-full bg-[#caeb66]" />
                                <span className="text-sm tracking-tight">Non-Document</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-xs text-gray-400">Up to 3kg</td>
                          <td className="px-10 py-8 text-right text-xl">৳110</td>
                          <td className="px-10 py-8 text-right text-xl">৳150</td>
                       </tr>
                       <tr className="hover:bg-white transition-colors group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-sm tracking-tight">Corporate Bulk</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-xs text-gray-400">&gt; 3kg Baseline</td>
                          <td className="px-10 py-8 text-right text-xl">+৳40/kg</td>
                          <td className="px-10 py-8 text-right text-xl">+৳40/kg <span className="text-[10px] text-gray-300 ml-1">+ ৳40 Base</span></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 bg-[#103d45] overflow-hidden relative">
         <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { icon: MdSpeed, title: "No Priority Surcharge", desc: "Unlike others, our express speeds are standard. No hidden fees for faster delivery." },
                 { icon: MdShield, title: "Transit Insurance", desc: "Every parcel is covered against loss or damage up to 10x the delivery fee." },
                 { icon: MdSavings, title: "Bulk Discounts", desc: "Automated scaling for high-volume merchants with monthly shipment targets." }
               ].map((v, i) => (
                 <div key={i} className="text-center md:text-left">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#caeb66] mb-8 mx-auto md:mx-0">
                       <v.icon className="text-4xl" />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-4">{v.title}</h4>
                    <p className="text-sm text-white/40 font-medium leading-relaxed">{v.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl lg:text-6xl font-black text-[#103d45] mb-12 tracking-tight">Found a rate <br/> <span className="text-gray-400 text-3xl lg:text-5xl">that works for you?</span></h3>
            <div className="flex flex-wrap justify-center gap-4">
               <button onClick={() => navigate('/send-parcel')} className="px-12 py-6 bg-[#caeb66] text-[#103d45] rounded-3xl font-black text-sm hover:scale-105 transition-all shadow-2xl shadow-lime-100">
                  Book Shipment Now
               </button>
               <button onClick={() => navigate('/about-us')} className="px-12 py-6 bg-gray-50 text-[#103d45] rounded-3xl font-black text-sm hover:bg-gray-100 transition-all">
                  Learn About Coverage
               </button>
            </div>
         </div>
      </section>
    </div>
  )
}

export default Pricing
