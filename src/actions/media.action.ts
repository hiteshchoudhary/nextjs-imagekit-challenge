"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  CreateMediaParams,
  MediaQueryParams,
  SelectMediaModel,
  UpdateMediaParams,
  createMediaSchema,
  media,
  mediaQuerySchema,
  updateMediaSchema,
} from "@/db/schema/media";
import { auth } from "@/lib/auth";
import { handleError } from "@/lib/handlers";
import action from "@/lib/handlers/action";
import { PaginatedSearchParamsSchema } from "@/lib/schema";
import { PaginatedSearchParams } from "@/types";
import { ActionResponse, ErrorResponse } from "@/types/global";

export const createMedia = async (
  params: CreateMediaParams
): Promise<ActionResponse<SelectMediaModel>> => {
  const validationResult = await action({
    params,
    schema: createMediaSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  const userId = session?.user?.id;

  if (!userId) {
    return handleError(new Error("User not authenticated")) as ErrorResponse;
  }

  const { fileName, originalUrl, mediaType, transformationConfig } =
    validationResult.params!;

  try {
    const [newMedia] = await db
      .insert(media)
      .values({
        userId,
        fileName,
        originalUrl,
        mediaType,
        transformationConfig,
      })
      .returning();

    if (!newMedia) {
      throw new Error("Failed to create media record");
    }

    revalidatePath("/");

    return { success: true, data: newMedia };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getMedia = cache(
  async (
    params: MediaQueryParams
  ): Promise<ActionResponse<SelectMediaModel>> => {
    const validationResult = await action({
      params,
      schema: mediaQuerySchema,
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    const { session } = validationResult;
    const userId = session?.user?.id;
    const { id } = validationResult.params!;

    try {
      const [mediaItem] = await db
        .select()
        .from(media)
        .where(and(eq(media.id, id), eq(media.userId, userId!)))
        .limit(1);

      if (!mediaItem) {
        throw new Error("Media not found or you do not have permission to view it.");
      }

      return { success: true, data: mediaItem };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }
);

export const getAllMedia = cache(
  async (
    params: PaginatedSearchParams
  ): Promise<ActionResponse<{ media: SelectMediaModel[]; isNext: boolean }>> => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: true, data: { media: [], isNext: false } };
    }

    const validationResult = await action({
      params,
      schema: PaginatedSearchParamsSchema,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    const { page = 1, pageSize = 10, filter } = validationResult.params!;
    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    try {
      const userCondition = eq(media.userId, userId);
      const filterCondition = filter
        ? eq(media.mediaType, filter.toUpperCase() as "IMAGE" | "VIDEO")
        : undefined;

      const whereCondition = filter ? and(userCondition, filterCondition) : userCondition;

      const [totalResult] = await db
        .select({ count: count() })
        .from(media)
        .where(whereCondition);

      const totalCount = totalResult?.count || 0;

      const mediaItems = await db
        .select()
        .from(media)
        .where(whereCondition)
        .orderBy(desc(media.createdAt))
        .offset(skip)
        .limit(limit);

      const isNext = totalCount > skip + limit;

      return {
        success: true,
        data: {
          media: mediaItems,
          isNext,
        },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }
);

export const updateMedia = async (
  params: UpdateMediaParams
): Promise<ActionResponse<SelectMediaModel>> => {
  const validationResult = await action({
    params,
    schema: updateMediaSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { session } = validationResult;
  const userId = session?.user?.id;
  const { id, transformedUrl, transformationConfig } = validationResult.params!;

  try {
    const [updatedMedia] = await db
      .update(media)
      .set({
        transformedUrl,
        transformationConfig,
      })
      .where(and(eq(media.id, id), eq(media.userId, userId!)))
      .returning();

    if (!updatedMedia) {
      throw new Error("Media not found or failed to update");
    }

    revalidatePath("/");
    revalidatePath(`/studio/${id}`);

    return { success: true, data: updatedMedia };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
