import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/dal";
import { logout } from "@/lib/actions/auth";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link href="/routes" className="text-lg font-bold">
        ツーリングルート共有
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/routes" className="hover:underline">
          ルート一覧
        </Link>
        {user ? (
          <>
            <Link href="/routes/new" className="hover:underline">
              ルートを投稿
            </Link>
            <span className="text-gray-500">{user.displayName}さん</span>
            <form action={logout}>
              <button type="submit" className="hover:underline">
                ログアウト
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              ログイン
            </Link>
            <Link href="/signup" className="hover:underline">
              新規登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
