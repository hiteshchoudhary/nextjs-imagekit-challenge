"use server";

import { type Session } from "next-auth";
import { ZodError, z } from "zod/v4";

import { auth } from "@/lib/auth";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";

type ActionOptions<T> = {
  params?: T;
  schema?: z.ZodSchema<T>;
  authorize?: boolean;
};

const action = async <T>({ params, schema, authorize }: ActionOptions<T>) => {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      }
      return new Error("Schema validation failed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  return { params, session };
};

export default action;
