import type { NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/dal";
import { WaypointSchema } from "@/lib/routes/definitions";

const RequestSchema = z.object({
  waypoints: z.array(WaypointSchema).min(2).max(500),
});

type OrsDirectionsResponse = {
  features: {
    geometry: { coordinates: [number, number][] };
    properties: { summary: { distance: number; duration: number } };
  }[];
};

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = RequestSchema.safeParse(body);
  if (!validated.success) {
    return Response.json({ error: "Invalid waypoints" }, { status: 400 });
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ORS_API_KEY is not set" }, { status: 500 });
  }

  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: validated.data.waypoints.map((w) => [w.lng, w.lat]),
      }),
      signal: request.signal,
    },
  );

  if (!res.ok) {
    return Response.json({ error: "Routing failed" }, { status: 502 });
  }

  const data = (await res.json()) as OrsDirectionsResponse;
  const feature = data.features?.[0];
  if (!feature) {
    return Response.json({ error: "No route found" }, { status: 502 });
  }

  const geometry = feature.geometry.coordinates.map(([lng, lat]) => ({
    lat,
    lng,
  }));

  return Response.json({
    geometry,
    distanceMeters: feature.properties.summary.distance,
    durationSeconds: feature.properties.summary.duration,
  });
}
