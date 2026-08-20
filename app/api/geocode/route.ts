import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/dal";

type OrsGeocodeFeature = {
  properties: { label: string };
  geometry: { coordinates: [number, number] };
};

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return Response.json({ results: [] });
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ORS_API_KEY is not set" }, { status: 500 });
  }

  const url = new URL("https://api.openrouteservice.org/geocode/search");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("text", q);
  url.searchParams.set("size", "5");
  url.searchParams.set("boundary.country", "JP");

  const res = await fetch(url, { signal: request.signal });
  if (!res.ok) {
    return Response.json({ error: "Geocoding failed" }, { status: 502 });
  }

  const data = (await res.json()) as { features?: OrsGeocodeFeature[] };
  const results = (data.features ?? []).map((f) => ({
    label: f.properties.label,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  }));

  return Response.json({ results });
}
