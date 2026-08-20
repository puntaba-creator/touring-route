"use client";

import { useActionState } from "react";
import { signup } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="displayName" className="text-sm font-medium">
          ニックネーム
        </label>
        <input
          id="displayName"
          name="displayName"
          className="rounded border border-gray-300 px-3 py-2"
          placeholder="ツーリング太郎"
        />
        {state?.errors?.displayName && (
          <p className="text-sm text-red-600">{state.errors.displayName[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="rounded border border-gray-300 px-3 py-2"
          placeholder="you@example.com"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="rounded border border-gray-300 px-3 py-2"
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {pending ? "登録中..." : "アカウントを作成"}
      </button>
    </form>
  );
}
