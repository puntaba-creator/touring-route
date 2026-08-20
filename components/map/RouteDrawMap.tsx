"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import { numberedIcon } from "@/lib/map/icons";
import type { Waypoint } from "@/lib/db/schema";

const DEFAULT_CENTER: [number, number] = [35.681236, 139.767125]; // 東京駅
const DEFAULT_ZOOM = 12;

function ClickCollector({ onAdd }: { onAdd: (point: Waypoint) => void }) {
  useMapEvents({
    click(e) {
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function RouteDrawMap({
  waypoints,
  onChange,
}: {
  waypoints: Waypoint[];
  onChange: (waypoints: Waypoint[]) => void;
}) {
  const positions = waypoints.map((w) => [w.lat, w.lng] as [number, number]);

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[420px] w-full overflow-hidden rounded border border-gray-300">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCollector
            onAdd={(point) => onChange([...waypoints, point])}
          />
          {positions.length > 1 && (
            <Polyline positions={positions} color="#2563eb" />
          )}
          {waypoints.map((w, i) => (
            <Marker key={i} position={[w.lat, w.lng]} icon={numberedIcon(i + 1)} />
          ))}
        </MapContainer>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">地図をクリックして経路を作成({waypoints.length}点)</span>
        <button
          type="button"
          onClick={() => onChange(waypoints.slice(0, -1))}
          disabled={waypoints.length === 0}
          className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
        >
          1つ戻す
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={waypoints.length === 0}
          className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
        >
          クリア
        </button>
      </div>
    </div>
  );
}
