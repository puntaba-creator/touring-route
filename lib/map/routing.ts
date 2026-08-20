import type { Waypoint } from "@/lib/db/schema";

export type GeocodeResult = { label: string; lat: number; lng: number };

export async function fetchGeocode(
  query: string,
  signal: AbortSignal,
): Promise<GeocodeResult[]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error("geocode failed");
  }
  const data = (await res.json()) as { results: GeocodeResult[] };
  return data.results;
}

export type RouteResult = {
  geometry: Waypoint[];
  distanceMeters: number;
  durationSeconds: number;
};

export async function fetchRoute(
  waypoints: Waypoint[],
  signal: AbortSignal,
): Promise<RouteResult> {
  const res = await fetch("/api/route-directions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ waypoints }),
    signal,
  });
  if (!res.ok) {
    throw new Error("routing failed");
  }
  return (await res.json()) as RouteResult;
}
