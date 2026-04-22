import React, { useRef, useMemo, useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData, useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdLocationOn, MdOutlineExplore, MdGroups, MdOutlineHub, MdKeyboardArrowRight, MdNavigation, MdMyLocation, MdMap, MdNotificationsActive, MdArrowForward } from "react-icons/md";
import { renderToString } from "react-dom/server";

// Premium Location Pin with Pulse Effect
const createLocationPin = (isActive) => {
  const color = isActive ? "#103d45" : "#caeb66";
  const iconHtml = renderToString(
    <div className="relative flex items-center justify-center">
      {isActive && <div className="absolute inset-0 bg-[#103d45]/20 rounded-full animate-ping" style={{ width: '44px', height: '44px', margin: '-4px' }}></div>}
      <div style={{ color: color, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
        <MdLocationOn size={isActive ? 46 : 38} />
      </div>
    </div>
  );
  return L.divIcon({
    html: iconHtml,
    className: "custom-leaflet-pin",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -35]
  });
};

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.8, easeLinearity: 0.25 });
    }
  }, [map, center, zoom]);
  return null;
};

const CoveragePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes("dashboard");
  const serviceCenters = useLoaderData() || [];
  
  const [query, setQuery] = useState("");
  const [activeCenter, setActiveCenter] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.685, 90.3563]);
  const [mapZoom, setMapZoom] = useState(7);

  const stats = useMemo(() => {
    return {
      districts: serviceCenters.length,
      areas: serviceCenters.reduce((acc, curr) => acc + curr.covered_area.length, 0),
      regions: [...new Set(serviceCenters.map(c => c.region))].length
    };
  }, [serviceCenters]);

  const filteredCenters = useMemo(() => {
    if (!query.trim()) return serviceCenters;
    return serviceCenters.filter((c) =>
      c.district.toLowerCase().includes(query.toLowerCase()) ||
      c.region.toLowerCase().includes(query.toLowerCase())
    );
  }, [serviceCenters, query]);

  // Automated Search-to-Map Sync
  useEffect(() => {
    if (query.length > 2) {
      const match = serviceCenters.find(c => c.district.toLowerCase() === query.toLowerCase());
      if (match) {
         setMapCenter([match.latitude, match.longitude]);
         setMapZoom(13);
         setActiveCenter(match);
      }
    }
  }, [query, serviceCenters]);

  const handleRequestExtension = async () => {
    const { value: email } = await Swal.fire({
      title: 'Expand to my area',
      input: 'email',
      inputLabel: 'Get notified when we launch in your district',
      inputPlaceholder: 'your-email@example.com',
      confirmButtonText: 'Notify Me',
      confirmButtonColor: '#103d45',
      showCancelButton: true,
      customClass: {
        popup: 'rounded-[2.5rem] p-8',
        input: 'rounded-2xl border-gray-100',
        confirmButton: 'rounded-2xl px-10 py-4 font-black',
        cancelButton: 'rounded-2xl px-10 py-4'
      }
    });

    if (email) {
      Swal.fire({ title: 'Success!', text: 'We will notify you soon.', icon: 'success', confirmButtonColor: '#caeb66' });
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row overflow-hidden bg-white selection:bg-[#103d45] selection:text-white ${isDashboard ? 'h-[calc(100vh-200px)] rounded-3xl border border-gray-100 shadow-sm' : 'h-[calc(100vh-100px)]'}`}>
      {/* Dynamic Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-[420px] bg-white flex flex-col relative z-20 border-r border-gray-50"
      >
        <div className="p-8 pb-4 flex-shrink-0 text-left">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-4 mb-10"
           >
              <div className="h-14 w-14 bg-[#103d45] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#103d45]/20">
                 <MdMap className="text-[#caeb66] text-3xl" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-[#103d45] tracking-tight">Coverage</h1>
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Live Network Status</p>
              </div>
           </motion.div>

           {/* Search Input - Left Aligned */}
           <div className="relative group mb-4">
              <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl group-focus-within:text-[#103d45] transition-colors" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find your area..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 pl-16 pr-8 text-sm font-bold text-[#103d45] outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all placeholder:text-gray-300"
              />
           </div>
        </div>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto px-8 py-2 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {filteredCenters.map((center) => (
              <motion.button
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={center.district}
                onClick={() => {
                  setMapCenter([center.latitude, center.longitude]);
                  setMapZoom(13);
                  setActiveCenter(center);
                }}
                className={`w-full text-left p-6 rounded-[2.5rem] border transition-all relative group overflow-hidden mb-4 last:mb-20 ${
                  activeCenter?.district === center.district 
                  ? "bg-[#103d45] border-[#103d45] text-white shadow-2xl shadow-[#103d45]/30" 
                  : "bg-white border-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <h3 className={`text-xl font-black ${activeCenter?.district === center.district ? "text-white" : "text-[#103d45]"}`}>
                        {center.district}
                      </h3>
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 ${activeCenter?.district === center.district ? "text-[#caeb66]" : "text-gray-400"}`}>
                        {center.region} HUB
                      </p>
                   </div>
                   <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${activeCenter?.district === center.district ? "bg-[#caeb66] text-[#103d45] rotate-45 scale-110" : "bg-gray-50 text-gray-300 group-hover:text-[#103d45]"}`}>
                      <MdArrowForward className="text-xl" />
                   </div>
                </div>
                
                {activeCenter?.district === center.district && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-6 pt-6 border-t border-white/10 relative z-10"
                  >
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Serviceable Points</p>
                     <div className="flex flex-wrap gap-2">
                        {center.covered_area.map(a => (
                          <span key={a} className="bg-white/10 text-[9px] font-black px-4 py-2 rounded-xl uppercase text-white border border-white/10 backdrop-blur-sm">
                             {a}
                          </span>
                        ))}
                     </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Pinned Bottom Area - Left Aligned Button */}
        <div className="p-8 bg-white border-t border-gray-50 flex-shrink-0 z-30">
           <button 
             onClick={() => navigate(isDashboard ? '/dashboard/user/send-parcel' : '/send-parcel')}
             className="w-full bg-[#caeb66] text-[#103d45] py-6 px-10 rounded-[2rem] font-black text-sm hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-start gap-4 shadow-xl shadow-[#caeb66]/10"
           >
              <MdNavigation className="text-2xl" />
              <span>Create Delivery</span>
           </button>
        </div>
      </motion.aside>

      {/* Main Map View */}
      <main className="flex-1 relative bg-white">
         <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            zoomControl={false}
            className="h-full w-full z-0"
          >
           <MapController center={mapCenter} zoom={mapZoom} />
           <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              attribution='&copy; ZapShift'
           />
           {serviceCenters.map((center) => (
             <Marker 
               key={center.district} 
               position={[center.latitude, center.longitude]}
               icon={createLocationPin(activeCenter?.district === center.district)}
               eventHandlers={{
                 click: () => {
                    setActiveCenter(center);
                    setMapCenter([center.latitude, center.longitude]);
                    setMapZoom(13);
                 },
               }}
             >
               <Popup className="custom-premium-popup">
                  <div className="p-6 min-w-[240px] bg-white">
                     <div className="flex items-center gap-2 mb-4">
                        <MdNotificationsActive className="text-lime-500 animate-bounce" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Hub</span>
                     </div>
                     <h4 className="text-2xl font-black text-[#103d45] mb-2">{center.district}</h4>
                     <p className="text-xs text-gray-500 leading-relaxed font-medium mb-6">
                        Serving {center.covered_area.length} primary zones with 24/7 fulfillment infrastructure.
                     </p>
                     <button 
                        onClick={() => navigate(isDashboard ? '/dashboard/user/send-parcel' : '/send-parcel')}
                        className="w-full bg-[#103d45] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-125 transition-all shadow-xl shadow-[#103d45]/20"
                     >
                        Initiate Pickup
                     </button>
                  </div>
               </Popup>
             </Marker>
           ))}
         </MapContainer>

         {/* Overlay Controls & Stats (Top Right) */}
         <div className="absolute top-10 right-10 flex flex-col gap-4 items-end">
            <div className="flex gap-4">
                <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white flex items-center gap-8">
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Live Nodes</p>
                      <p className="text-2xl font-black text-[#103d45]">{stats.districts}</p>
                   </div>
                   <div className="h-10 w-[1px] bg-gray-100" />
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Network Health</p>
                      <div className="flex items-center gap-2 justify-end">
                         <span className="h-2 w-2 rounded-full bg-lime-500 animate-pulse" />
                         <p className="text-sm font-black text-[#103d45]">Active</p>
                      </div>
                   </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setMapCenter([23.685, 90.3563]); setMapZoom(7); setActiveCenter(null); }}
                    className="p-6 bg-white border border-gray-100 rounded-[2.5rem] text-[#103d45] shadow-2xl hover:bg-[#103d45] hover:text-white transition-all"
                >
                    <MdMyLocation className="text-2xl" />
                </motion.button>
            </div>
         </div>

         {/* Smaller "Can't find area" card (Bottom Right) */}
         <div className="absolute bottom-10 right-10 max-w-[340px] hidden sm:block">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/90 backdrop-blur-2xl border border-white p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
               <div className="relative z-10">
                  <h4 className="text-xl font-black text-[#103d45] mb-3 leading-tight">Can't find <br/> your area?</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium mb-6">
                    We're expanding daily. Request a priority hub launch in your district.
                  </p>
                  <button 
                    onClick={handleRequestExtension}
                    className="flex items-center gap-2 text-xs font-black text-[#103d45] hover:gap-4 transition-all group"
                  >
                    Request Expansion <MdKeyboardArrowRight className="text-xl text-[#caeb66] group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
            </motion.div>
         </div>
      </main>
    </div>
  );
};

export default CoveragePage;
