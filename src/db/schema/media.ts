import {InferSelectModel} from "drizzle-orm";
import {jsonb, pgTable, text, uuid, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod/v4";

import {TransformationConfig} from "@/types";

import {mediaTypeEnum, timestamps} from "./columns-helpers";
import { users } from "./auth";

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("file_name", {length: 255}).notNull(),
  originalUrl: text("original_url").notNull(),
  transformedUrl: text("transformed_url").default(""),
  transformationConfig: jsonb("transformation_config")
    .$type<TransformationConfig>()
    .default({} as TransformationConfig),
  mediaType: mediaTypeEnum("type"),
  ...timestamps,
});

const baseSchema = createInsertSchema(media, {

  fileName: schema =>
    schema
      .min(1, {message: "File name is required."})
      .max(255, {message: "File name cannot exceed 255 characters."})
      .regex(/^[^<>:"/\\|?*]+$/, {
        message: "File name contains invalid characters.",
      }),
  originalUrl: z.url({message: "Please provide a valid original URL."}),
  transformedUrl: z
    .url({message: "Please provide a valid transformed URL."})
    .optional(),
  mediaType: schema => schema,
}).pick({
  fileName: true,
  originalUrl: true,
  transformedUrl: true,
  mediaType: true,
});

export const createMediaSchema = z.object({
  fileName: baseSchema.shape.fileName,
  originalUrl: baseSchema.shape.originalUrl,
  mediaType: baseSchema.shape.mediaType,
  transformedUrl: baseSchema.shape.transformedUrl,
  transformationConfig: z.any().optional(),
});

export const updateMediaSchema = z.object({
  id: z.uuid({message: "Please provide a valid media ID."}),
  fileName: baseSchema.shape.fileName.optional(),
  originalUrl: baseSchema.shape.originalUrl.optional(),
  transformedUrl: baseSchema.shape.transformedUrl,
  mediaType: baseSchema.shape.mediaType.optional(),
  transformationConfig: z.any().optional(),
});

export const mediaQuerySchema = z.object({
  id: z.uuid({message: "Please provide a valid media ID."}),
});

export type SelectMediaModel = InferSelectModel<typeof media>;
export type CreateMediaParams = z.infer<typeof createMediaSchema>;
export type UpdateMediaParams = z.infer<typeof updateMediaSchema>;
export type MediaQueryParams = z.infer<typeof mediaQuerySchema>;
