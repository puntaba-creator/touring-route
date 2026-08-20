import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <LoginForm />
      <p className="text-sm text-gray-600">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-blue-600 underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
