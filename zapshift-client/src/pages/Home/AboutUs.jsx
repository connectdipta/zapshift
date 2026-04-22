import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdRocketLaunch, MdPublic, MdFlashOn, MdMenuBook, MdTrackChanges, MdStar, MdDiamond, MdLock, 
  MdAttachMoney, MdPhone, MdGroups, MdSpa, MdLightbulb, MdEmojiEvents,
  MdArrowForward, MdKeyboardArrowRight, MdOutlineVerified, MdSecurity, MdSpeed
} from 'react-icons/md'
import { useNavigate } from 'react-router'

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story')

  const tabs = [
    { id: 'story', label: 'Our Story', icon: MdMenuBook, color: 'text-blue-500' },
    { id: 'mission', label: 'Mission', icon: MdTrackChanges, color: 'text-red-500' },
    { id: 'vision', label: 'Vision', icon: MdStar, color: 'text-amber-500' },
    { id: 'values', label: 'Values', icon: MdDiamond, color: 'text-purple-500' }
  ]

  const tabContent = {
    story: {
      title: "Born to Revolutionize",
      text: "ZapShift emerged from a singular vision: to bridge the gap between traditional logistics and the digital-first economy. Starting as a small fleet in Dhaka, we realized that parcel delivery isn't just about moving boxes—it's about connecting businesses to their dreams and families to their loved ones with absolute transparency.",
      stats: ["Est. 2021", "12M+ Parcels", "99% Success"]
    },
    mission: {
      title: "Efficiency Without Compromise",
      text: "Our mission is to democratize high-speed logistics. We empower small businesses by providing them with the same technological backbone as global giants, while ensuring our rider fleet enjoys fair compensation, safe working conditions, and professional growth opportunities.",
      stats: ["Zero Hidden Costs", "Fair Wages", "Digital First"]
    },
    vision: {
      title: "The Future of Last-Mile",
      text: "We envision a South Asia where distance is no longer a barrier to commerce. By integrating AI-driven routing and sustainable electric fleets, we aim to become the most carbon-efficient logistics network in the region by 2030.",
      stats: ["Asia-Wide Network", "Zero Emission Goal", "AI Driven"]
    },
    values: {
      title: "The ZapShift DNA",
      text: "Trust, Speed, and Radical Transparency. These aren't just words on a wall; they are the principles that guide every pickup and every handshake. We believe in taking ownership of every shipment, treating every parcel as if it were our own.",
      stats: ["Human-Centric", "Security First", "Relentless Care"]
    }
  }

  const features = [
    { icon: MdSpeed, title: 'Hyper-Local Speed', desc: 'Predictive routing ensures your parcels spend less time in transit and more time in customers\' hands.' },
    { icon: MdSecurity, title: 'Military-Grade Safety', desc: 'Real-time GPS monitoring and multi-step OTP verification keep every shipment secure.' },
    { icon: MdPublic, title: 'Universal Reach', desc: 'From urban skyscrapers to remote rural villages, our network spans the entire geography.' },
    { icon: MdOutlineVerified, title: 'Digital Proofing', desc: 'Instant photo confirmation and digital signatures for every successful delivery.' }
  ]

  return (
    <div className="min-h-screen bg-[#fcfdf2] selection:bg-[#103d45] selection:text-white">
      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-52 overflow-hidden bg-[#103d45]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lime-400/5 rounded-full -mr-96 -mt-96 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-lime-400/10 px-6 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-lime-400 mb-10 border border-lime-400/20"
          >
            <MdRocketLaunch className="text-lg" /> Defining Modern Logistics
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-8"
          >
            We're building the <br/> <span className="text-[#caeb66]">next-gen network.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-white/50 font-medium leading-relaxed"
          >
            ZapShift is more than a delivery company. We are a technology-driven infrastructure provider 
            transforming commerce across Bangladesh.
          </motion.p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 lg:-mt-32 relative z-20">
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-black/10 overflow-hidden lg:flex">
          <div className="lg:w-1/3 bg-gray-50/80 p-8 lg:p-16 border-r border-gray-100">
             <div className="space-y-2 mb-12">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-500 group ${activeTab === tab.id ? 'bg-[#103d45] text-white shadow-xl shadow-[#103d45]/20' : 'hover:bg-white text-gray-400'}`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon className={`text-xl ${activeTab === tab.id ? 'text-[#caeb66]' : tab.color}`} />
                      <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                    </div>
                    <MdKeyboardArrowRight className={`text-2xl transition-transform ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                ))}
             </div>

             <div className="p-8 rounded-[2.5rem] bg-[#caeb66] text-[#103d45]">
                <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-60">Global Recognition</p>
                <MdEmojiEvents className="text-4xl mb-6" />
                <h4 className="text-xl font-black leading-tight mb-2">Logistics Innovation Award 2024</h4>
                <p className="text-xs font-bold opacity-70">Awarded for revolutionary last-mile tracking infrastructure.</p>
             </div>
          </div>

          <div className="lg:w-2/3 p-10 lg:p-24 bg-white relative">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.4 }}
               >
                  <h2 className="text-4xl lg:text-6xl font-black text-[#103d45] mb-8 leading-tight">{tabContent[activeTab].title}</h2>
                  <p className="text-lg lg:text-xl text-gray-500 font-medium leading-relaxed mb-12">
                    {tabContent[activeTab].text}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-100">
                     {tabContent[activeTab].stats.map((s, i) => (
                       <div key={i}>
                          <p className="text-2xl font-black text-[#103d45]">{s}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Milestone Indicator</p>
                       </div>
                     ))}
                  </div>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl lg:text-6xl font-black text-[#103d45] tracking-tight mb-6">Built for scale, <br/> <span className="text-gray-400">delivered with care.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-gray-50 border border-transparent hover:border-[#caeb66] hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className="h-16 w-16 rounded-2xl bg-[#103d45] text-[#caeb66] flex items-center justify-center mb-8 shadow-xl shadow-[#103d45]/10">
                   <f.icon className="text-3xl" />
                </div>
                <h3 className="text-2xl font-black text-[#103d45] mb-4">{f.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[#103d45] py-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[40px] border-[#caeb66] rounded-full opacity-5" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
              {[
                { val: "64/64", label: "Districts Coverage" },
                { val: "1.2M", label: "Monthly Shipments" },
                { val: "500+", label: "Professional Hubs" },
                { val: "24/7", label: "Operation Uptime" }
              ].map((s, i) => (
                <div key={i}>
                   <p className="text-5xl lg:text-7xl font-black text-[#caeb66] mb-2">{s.val}</p>
                   <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{s.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-[#caeb66] to-[#b8d94a] p-10 lg:p-24 lg:flex items-center justify-between shadow-2xl shadow-lime-200">
               <div className="lg:max-w-xl">
                  <h3 className="text-4xl lg:text-6xl font-black text-[#103d45] mb-8 leading-tight">Ready to shift <br/> your logistics?</h3>
                  <p className="text-lg text-[#103d45]/60 font-bold mb-12">
                    Join over 5,000 corporate partners who rely on ZapShift for their daily delivery requirements.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <button onClick={() => navigate('/send-parcel')} className="px-10 py-5 bg-[#103d45] text-white rounded-[2rem] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
                        Send Parcel Now
                     </button>
                     <button onClick={() => navigate('/rider')} className="px-10 py-5 bg-white/50 text-[#103d45] rounded-[2rem] font-black text-sm hover:bg-white transition-all">
                        Become a Partner
                     </button>
                  </div>
               </div>
               
               <div className="hidden lg:block">
                  <div className="h-96 w-96 rounded-[5rem] bg-[#103d45] flex items-center justify-center shadow-2xl rotate-6">
                     <MdRocketLaunch className="text-white text-9xl -rotate-45" />
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}

export default AboutUs
