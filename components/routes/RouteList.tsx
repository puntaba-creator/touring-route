import { RouteCard } from "@/components/routes/RouteCard";

type RouteSummary = {
  id: string;
  title: string;
  area: string | null;
  authorName: string;
  likeCount: number;
  createdAt: Date;
};

export function RouteList({ routes }: { routes: RouteSummary[] }) {
  if (routes.length === 0) {
    return (
      <p className="text-gray-500">
        まだ投稿されたルートがありません。最初のルートを投稿してみましょう。
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}
