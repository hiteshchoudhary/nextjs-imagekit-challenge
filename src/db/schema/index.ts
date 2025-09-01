import * as authSchema from "./auth";
import * as mediaSchema from "./media";

export const schema = { ...authSchema, ...mediaSchema };

export * from "./columns-helpers";
export * from "./media";
export * from "./auth";
