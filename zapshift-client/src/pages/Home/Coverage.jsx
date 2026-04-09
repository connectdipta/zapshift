import React, { useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLoaderData } from "react-router";
import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import Footer from '../../components/Footer'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Coverage = () => {
  const position = [23.685, 90.3563];
  const serviceCenters = useLoaderData();
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const location = e.target.location.value.trim();
    if (!location) return;

    const found = serviceCenters.find((c) =>
      c.district.toLowerCase().includes(location.toLowerCase())
    );

    if (!found) {
      Store.addNotification({
        title: "Not Found",
        message: "District not found!",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: true
        }
      });
      return;
    }

    mapRef.current.flyTo([found.latitude, found.longitude], 14, {
      duration: 1.5,
    });
  };

  return (
    <div className=" mx-auto bg-white rounded-3xl p-10 pt-2 shadow-2xl mt-6 mb-6">
      <ReactNotifications />
      <div className="">
        {/* Header */}
        <div className="py-12 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Coverage Area</h1>
          <p className="text-gray-600">
            We are available in <span className="font-extrabold">64 districts</span> across Bangladesh with fast, reliable delivery services.
          </p>
        </div>

        {/* Search Section */}
        <div className="py-6 px-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-xl">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 w-full">
              <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.3" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" name="location" placeholder="Search here" className="w-full outline-none text-gray-700" />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 rounded-lg font-semibold transition hover:brightness-90 text-gray-900"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="py-12 px-6">
          <h3 className="mb-6 text-xl font-semibold text-gray-900">
            We deliver almost all over Bangladesh
          </h3>

          <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 shadow">
            <MapContainer center={position} zoom={7} scrollWheelZoom={true} ref={mapRef} className="h-full w-full">
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {serviceCenters.map((center, index) => (
                <Marker key={index} position={[center.latitude, center.longitude]}>
                  <Popup>
                    <strong>{center.district}</strong> <br />
                    Service Areas: {center.covered_area.join(", ")}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
