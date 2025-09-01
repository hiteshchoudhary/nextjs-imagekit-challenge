import pino from "pino";

import {env} from "@/env";

const isEdge = env.NEXT_RUNTIME === "edge";
const isProduction = env.NODE_ENV === "production";

export const logger = pino({
  level: env.LOG_LEVEL || "info",
  transport:
    !isEdge && !isProduction
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
  formatters: {
    level: label => ({level: label.toUpperCase()}),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

