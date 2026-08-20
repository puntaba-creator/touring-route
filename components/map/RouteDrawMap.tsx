"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { numberedIcon } from "@/lib/map/icons";
import { fetchRoute, type GeocodeResult } from "@/lib/map/routing";
import { RouteSearchBox } from "@/components/map/RouteSearchBox";
import type { Waypoint } from "@/lib/db/schema";

const DEFAULT_CENTER: [number, number] = [35.681236, 139.767125]; // 東京駅
const DEFAULT_ZOOM = 12;
const ROUTING_DEBOUNCE_MS = 500;

function ClickCollector({ onAdd }: { onAdd: (point: Waypoint) => void }) {
  useMapEvents({
    click(e) {
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyTo({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 14);
    }
  }, [target, map]);

  return null;
}

export function RouteDrawMap({
  waypoints,
  onChange,
  onRouteGeometryChange,
}: {
  waypoints: Waypoint[];
  onChange: (waypoints: Waypoint[]) => void;
  onRouteGeometryChange: (geometry: Waypoint[] | null) => void;
}) {
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<Waypoint[] | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);

  useEffect(() => {
    if (waypoints.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setIsRouting(true);
      setRoutingError(null);
      fetchRoute(waypoints, controller.signal)
        .then((result) => {
          setRouteGeometry(result.geometry);
          onRouteGeometryChange(result.geometry);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setRoutingError(
              "ルート計算に失敗しました。直線で表示しています。",
            );
          }
        })
        .finally(() => setIsRouting(false));
    }, ROUTING_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypoints]);

  function handleSelectSearchResult(result: GeocodeResult) {
    setFlyToTarget({ lat: result.lat, lng: result.lng });
  }

  function handleMarkerDragEnd(index: number, lat: number, lng: number) {
    const updated = [...waypoints];
    updated[index] = { lat, lng };
    onChange(updated);
  }

  function resetRouting() {
    setRouteGeometry(null);
    onRouteGeometryChange(null);
    setRoutingError(null);
    setIsRouting(false);
  }

  function handleUndo() {
    const next = waypoints.slice(0, -1);
    if (next.length < 2) resetRouting();
    onChange(next);
  }

  function handleClear() {
    resetRouting();
    onChange([]);
  }

  const linePositions = (
    routeGeometry && routeGeometry.length > 1 ? routeGeometry : waypoints
  ).map((w) => [w.lat, w.lng] as [number, number]);

  return (
    <div className="flex flex-col gap-2">
      <RouteSearchBox onSelect={handleSelectSearchResult} />
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
          <ClickCollector onAdd={(point) => onChange([...waypoints, point])} />
          <FlyTo target={flyToTarget} />
          {linePositions.length > 1 && (
            <Polyline positions={linePositions} color="#2563eb" />
          )}
          {waypoints.map((w, i) => (
            <Marker
              key={i}
              position={[w.lat, w.lng]}
              icon={numberedIcon(i + 1)}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  handleMarkerDragEnd(i, lat, lng);
                },
              }}
            />
          ))}
        </MapContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-600">
          地図をクリックして経路を作成、マーカーをドラッグで調整({waypoints.length}点)
        </span>
        {isRouting && <span className="text-gray-500">経路を計算中...</span>}
        {routingError && <span className="text-red-600">{routingError}</span>}
        <button
          type="button"
          onClick={handleUndo}
          disabled={waypoints.length === 0}
          className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
        >
          1つ戻す
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={waypoints.length === 0}
          className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
        >
          クリア
        </button>
      </div>
    </div>
  );
}
