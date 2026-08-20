"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { likes } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/dal";

export async function toggleLike(routeId: string) {
  const user = await requireUser();

  const [existing] = await db
    .select({ userId: likes.userId })
    .from(likes)
    .where(and(eq(likes.userId, user.id), eq(likes.routeId, routeId)))
    .limit(1);

  if (existing) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, user.id), eq(likes.routeId, routeId)));
  } else {
    await db.insert(likes).values({ userId: user.id, routeId });
  }

  revalidatePath(`/routes/${routeId}`);
  revalidatePath("/routes");
}
