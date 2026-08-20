import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { readSessionCookie } from "@/lib/auth/session";

export const getCurrentUser = cache(async () => {
  const payload = await readSessionCookie();
  if (!payload?.sessionId) return null;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, payload.sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return row ?? null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
