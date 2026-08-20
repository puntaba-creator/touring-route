import Link from "next/link";
import { listRoutes } from "@/lib/actions/routes";
import { RouteList } from "@/components/routes/RouteList";

export default async function RoutesPage() {
  const routes = await listRoutes();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">おすすめツーリングルート</h1>
        <Link
          href="/routes/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          ルートを投稿する
        </Link>
      </div>
      <RouteList routes={routes} />
    </div>
  );
}
