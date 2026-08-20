import Link from "next/link";

export function RouteCard({
  route,
}: {
  route: {
    id: string;
    title: string;
    area: string | null;
    authorName: string;
    likeCount: number;
    createdAt: Date;
  };
}) {
  return (
    <Link
      href={`/routes/${route.id}`}
      className="flex flex-col gap-2 rounded border border-gray-200 p-4 transition hover:border-blue-400 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{route.title}</h2>
        {route.area && (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
            {route.area}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>投稿者: {route.authorName}</span>
        <span>いいね {route.likeCount}</span>
      </div>
    </Link>
  );
}
