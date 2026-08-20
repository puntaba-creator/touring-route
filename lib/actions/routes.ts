"use server";

import { redirect } from "next/navigation";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { routes, users, likes } from "@/lib/db/schema";
import { requireUser, getCurrentUser } from "@/lib/auth/dal";
import {
  CreateRouteSchema,
  type CreateRouteInput,
  type CreateRouteState,
} from "@/lib/routes/definitions";

export async function createRoute(
  input: CreateRouteInput,
): Promise<CreateRouteState> {
  const user = await requireUser();

  const validated = CreateRouteSchema.safeParse(input);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { title, description, area, waypoints, routeGeometry } = validated.data;

  const [route] = await db
    .insert(routes)
    .values({
      authorId: user.id,
      title,
      description: description || null,
      area: area || null,
      waypoints,
      routeGeometry: routeGeometry ?? null,
    })
    .returning({ id: routes.id });

  if (!route) {
    return { message: "ルートの保存に失敗しました。" };
  }

  redirect(`/routes/${route.id}`);
}

export async function listRoutes() {
  return db
    .select({
      id: routes.id,
      title: routes.title,
      area: routes.area,
      createdAt: routes.createdAt,
      authorName: users.displayName,
      likeCount: sql<number>`count(distinct ${likes.userId})`.mapWith(Number),
    })
    .from(routes)
    .innerJoin(users, eq(routes.authorId, users.id))
    .leftJoin(likes, eq(likes.routeId, routes.id))
    .groupBy(routes.id, users.displayName)
    .orderBy(desc(routes.createdAt));
}

export async function getRoute(routeId: string) {
  const currentUser = await getCurrentUser();

  const [route] = await db
    .select({
      id: routes.id,
      title: routes.title,
      description: routes.description,
      area: routes.area,
      waypoints: routes.waypoints,
      routeGeometry: routes.routeGeometry,
      createdAt: routes.createdAt,
      authorId: routes.authorId,
      authorName: users.displayName,
      likeCount: sql<number>`count(distinct ${likes.userId})`.mapWith(Number),
    })
    .from(routes)
    .innerJoin(users, eq(routes.authorId, users.id))
    .leftJoin(likes, eq(likes.routeId, routes.id))
    .where(eq(routes.id, routeId))
    .groupBy(routes.id, users.displayName);

  if (!route) return null;

  let likedByCurrentUser = false;
  if (currentUser) {
    const [likeRow] = await db
      .select({ userId: likes.userId })
      .from(likes)
      .where(sql`${likes.routeId} = ${routeId} and ${likes.userId} = ${currentUser.id}`)
      .limit(1);
    likedByCurrentUser = Boolean(likeRow);
  }

  return { ...route, likedByCurrentUser, isAuthenticated: Boolean(currentUser) };
}
