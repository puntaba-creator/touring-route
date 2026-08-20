"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { toggleLike } from "@/lib/actions/likes";

export function LikeButton({
  routeId,
  initialLiked,
  initialCount,
  isAuthenticated,
}: {
  routeId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
}) {
  const [, startTransition] = useTransition();
  const [state, setOptimisticLiked] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (current, liked: boolean) => ({
      liked,
      count: current.count + (liked ? 1 : -1),
    }),
  );

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm"
      >
        いいね {initialCount}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          setOptimisticLiked(!state.liked);
          await toggleLike(routeId);
        });
      }}
      className={`inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium ${
        state.liked
          ? "bg-blue-600 text-white"
          : "border border-gray-300 text-gray-800"
      }`}
    >
      {state.liked ? "いいね済み" : "いいね"} {state.count}
    </button>
  );
}
