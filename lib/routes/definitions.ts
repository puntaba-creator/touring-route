import { z } from "zod";

export const WaypointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const CreateRouteSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください。").max(100),
  description: z.string().trim().max(2000).optional(),
  area: z.string().trim().max(50).optional(),
  waypoints: z
    .array(WaypointSchema)
    .min(2, "地図をクリックして2点以上の経路を作成してください。")
    .max(500, "経路のポイント数が多すぎます。"),
});

export type CreateRouteInput = z.infer<typeof CreateRouteSchema>;

export type CreateRouteState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        area?: string[];
        waypoints?: string[];
      };
      message?: string;
    }
  | undefined;
