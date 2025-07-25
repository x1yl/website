import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const execRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.execDetails.findMany({
      include: {
        user: true,
      },
      orderBy: [{ position: "asc" }, { user: { name: "asc" } }],
    });
  }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.execDetails.findUnique({
        where: { email: input.email },
        include: {
          user: true,
        },
      });
    }),
});
