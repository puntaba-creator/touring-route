"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { numberedIcon } from "@/lib/map/icons";
import type { Waypoint } from "@/lib/db/schema";

export function RouteMapView({ waypoints }: { waypoints: Waypoint[] }) {
  const positions = waypoints.map((w) => [w.lat, w.lng] as [number, number]);
  const bounds = positions.length > 0 ? positions : undefined;

  return (
    <div className="h-[420px] w-full overflow-hidden rounded border border-gray-300">
      <MapContainer
        bounds={bounds}
        center={positions[0] ?? [35.681236, 139.767125]}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 1 && <Polyline positions={positions} color="#2563eb" />}
        {waypoints.map((w, i) => (
          <Marker key={i} position={[w.lat, w.lng]} icon={numberedIcon(i + 1)} />
        ))}
      </MapContainer>
    </div>
  );
}
