"use client";

import dynamic from "next/dynamic";
import type { Waypoint } from "@/lib/db/schema";

const RouteMapView = dynamic(
  () => import("@/components/map/RouteMapView").then((m) => m.RouteMapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded border border-gray-300 bg-gray-50 text-sm text-gray-500">
        地図を読み込み中...
      </div>
    ),
  },
);

export function RouteMapViewClient({
  waypoints,
  routeGeometry,
}: {
  waypoints: Waypoint[];
  routeGeometry?: Waypoint[] | null;
}) {
  return <RouteMapView waypoints={waypoints} routeGeometry={routeGeometry} />;
}
