"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { createRoute } from "@/lib/actions/routes";
import type { CreateRouteState } from "@/lib/routes/definitions";
import type { Waypoint } from "@/lib/db/schema";

const RouteDrawMap = dynamic(
  () => import("@/components/map/RouteDrawMap").then((m) => m.RouteDrawMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded border border-gray-300 bg-gray-50 text-sm text-gray-500">
        地図を読み込み中...
      </div>
    ),
  },
);

export function NewRouteForm() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<Waypoint[] | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [state, setState] = useState<CreateRouteState>(undefined);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createRoute({
        title,
        description,
        area,
        waypoints,
        routeGeometry: routeGeometry ?? undefined,
      });
      setState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <RouteDrawMap
        waypoints={waypoints}
        onChange={setWaypoints}
        onRouteGeometryChange={setRouteGeometry}
      />
      {state?.errors?.waypoints && (
        <p className="text-sm text-red-600">{state.errors.waypoints[0]}</p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          タイトル
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
          placeholder="例: 山中湖から富士山一周ルート"
        />
        {state?.errors?.title && (
          <p className="text-sm text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="area" className="text-sm font-medium">
          エリア(任意)
        </label>
        <input
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
          placeholder="例: 山梨県"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          説明(任意)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded border border-gray-300 px-3 py-2"
          placeholder="見どころや注意点など"
        />
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded bg-blue-600 px-6 py-2 font-medium text-white disabled:opacity-50"
      >
        {isPending ? "投稿中..." : "ルートを投稿する"}
      </button>
    </form>
  );
}
