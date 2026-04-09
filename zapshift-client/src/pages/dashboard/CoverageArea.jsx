import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MdSearch } from "react-icons/md";
import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);

  return null;
};

const CoverageArea = () => {
  const [serviceCenters, setServiceCenters] = useState([]);
  const [query, setQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([23.685, 90.3563]);
  const [mapZoom, setMapZoom] = useState(7);

  useEffect(() => {
    fetch("/serviceCenters.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data))
      .catch(() => setServiceCenters([]));
  }, []);

  const filteredCenters = useMemo(() => {
    if (!query.trim()) return serviceCenters;
    return serviceCenters.filter((center) =>
      center.district.toLowerCase().includes(query.toLowerCase())
    );
  }, [serviceCenters, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = serviceCenters.find((center) =>
      center.district.toLowerCase().includes(query.toLowerCase())
    );

    if (!found) {
      Store.addNotification({
        title: "Not Found",
        message: "District not found!",
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: { duration: 2500, onScreen: true },
      });
      return;
    }

    setMapCenter([found.latitude, found.longitude]);
    setMapZoom(13);
  };

  return (
    <div className="space-y-6">
      <ReactNotifications />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Coverage Area</h1>
        <p className="mt-2 text-gray-600">Search serviceable districts and view active delivery zones.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search district"
              className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-lg px-6 py-3 font-semibold text-[#111] hover:brightness-95" style={{ backgroundColor: "var(--color-primary)" }}>
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Service Map</h2>
            <p className="text-sm text-gray-500">{filteredCenters.length} districts</p>
          </div>
          <div className="h-[480px] overflow-hidden rounded-xl border border-gray-200">
            <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom className="h-full w-full">
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {serviceCenters.map((center) => (
                <Marker key={center.district} position={[center.latitude, center.longitude]}>
                  <Popup>
                    <strong>{center.district}</strong>
                    <br />
                    {center.region}
                    <br />
                    Areas: {center.covered_area.join(", ")}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Covered Districts</h2>
          <div className="max-h-[480px] space-y-3 overflow-auto pr-1">
            {filteredCenters.map((center) => (
              <button
                key={center.district}
                type="button"
                onClick={() => {
                  setMapCenter([center.latitude, center.longitude]);
                  setMapZoom(13);
                }}
                className="w-full rounded-xl border border-gray-200 p-4 text-left transition hover:border-[var(--color-primary)] hover:bg-gray-50"
              >
                <p className="font-semibold text-gray-900">{center.district}</p>
                <p className="text-sm text-gray-500">{center.region}</p>
                <p className="mt-2 text-xs text-gray-500">{center.covered_area.join(", ")}</p>
              </button>
            ))}
            {filteredCenters.length === 0 && <p className="text-sm text-gray-500">No districts match your search.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageArea;
