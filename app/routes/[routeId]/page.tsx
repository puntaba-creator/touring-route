import { notFound } from "next/navigation";
import { getRoute } from "@/lib/actions/routes";
import { RouteMapViewClient } from "@/components/map/RouteMapViewClient";
import { LikeButton } from "@/components/routes/LikeButton";

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;
  const route = await getRoute(routeId);

  if (!route) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{route.title}</h1>
          {route.area && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
              {route.area}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">投稿者: {route.authorName}</p>
      </div>

      <RouteMapViewClient waypoints={route.waypoints} />

      {route.description && (
        <p className="whitespace-pre-wrap text-gray-800">{route.description}</p>
      )}

      <LikeButton
        routeId={route.id}
        initialLiked={route.likedByCurrentUser}
        initialCount={route.likeCount}
        isAuthenticated={route.isAuthenticated}
      />
    </div>
  );
}
