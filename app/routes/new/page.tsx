import { requireUser } from "@/lib/auth/dal";
import { NewRouteForm } from "@/components/routes/NewRouteForm";

export default async function NewRoutePage() {
  await requireUser();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">ルートを投稿する</h1>
      <NewRouteForm />
    </div>
  );
}
