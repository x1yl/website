import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    AUTH_AUTH0_ID: z.string(),
    AUTH_AUTH0_SECRET: z.string(),
    AUTH_AUTH0_ISSUER: z.string().url(),
    DATABASE_URL: z.string().url(),
    CSV_USERS_PATH: z.string().optional(),
    CSV_EXEC_DETAILS_PATH: z.string().optional(),
    CSV_EVENTS_PATH: z.string().optional(),
    CSV_EVENT_ATTENDEES_PATH: z.string().optional(),
    CSV_DELETED_USERS_PATH: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    AUTH_AUTH0_ID: process.env.AUTH_AUTH0_ID,
    AUTH_AUTH0_SECRET: process.env.AUTH_AUTH0_SECRET,
    AUTH_AUTH0_ISSUER: process.env.AUTH_AUTH0_ISSUER,
    DATABASE_URL: process.env.DATABASE_URL,
    CSV_USERS_PATH: process.env.CSV_USERS_PATH,
    CSV_EXEC_DETAILS_PATH: process.env.CSV_EXEC_DETAILS_PATH,
    CSV_EVENTS_PATH: process.env.CSV_EVENTS_PATH,
    CSV_EVENT_ATTENDEES_PATH: process.env.CSV_EVENT_ATTENDEES_PATH,
    CSV_DELETED_USERS_PATH: process.env.CSV_DELETED_USERS_PATH,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
