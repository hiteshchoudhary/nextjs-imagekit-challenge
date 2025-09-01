import {Pool, neonConfig} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-serverless";
import ws from "ws";

import {env} from "@/env";
import { schema } from "./schema";
// import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({connectionString: env.DATABASE_URL});
const db = drizzle(pool, {schema});

export {db};
export type DB = typeof db;
