import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      orderBy: { eventTime: "desc" }, // Show most recent events first
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
      // Remove date filter to show all events (past and future)
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.event.findUnique({
        where: { id: input.id },
        include: {
          attendees: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  getPast: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      orderBy: { eventTime: "desc" },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
      where: {
        eventTime: {
          lt: new Date(),
        },
      },
    });
  }),
});
