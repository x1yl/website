import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        email: true,
        name: true,
        preferredName: true,
        registeredAt: true,
        givenCredits: true,
      },
      orderBy: {
        registeredAt: "asc",
      },
    });
  }),

  getDeletedUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.deletedUsers.findMany({
      select: {
        registeredAt: true,
        leftAt: true,
      },
      orderBy: {
        leftAt: "asc",
      },
    });
  }),

  getAllAttendances: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.eventAttendance.findMany({
      where: {
        earnedHours: {
          gt: 0,
        },
      },
      select: {
        earnedHours: true,
      },
    });
  }),
});
