import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const historyRouter = createTRPCRouter({  
getHistory: protectedProcedure
    .input((z.object({
        userId: z.string(),
    })))
    .query(async({ ctx, input }) => {
        const records = await ctx.db.records.findMany({
            where: {
                userId: input.userId
            },
            include:{
                locations: {
                    select: {
                        id: true,
                        name: true,
                        location: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                dateFrom: "asc"
            }
        })
        return records;
    }),
 createHistory: protectedProcedure
    .input(
      z.object({
        user: z.string(),
        dateFrom: z.string(),
        dateTo: z.string(),
        location: z.array(
          z.object({
            id: z.number(), 
            name: z.string(),
          })
        ),
        purpose: z.string(),
        documentTracker: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.records.create({
        data: {
          userId: input.user,
          dateFrom: new Date(input.dateFrom),
          dateTo: new Date(input.dateTo),
          purpose: input.purpose,
          documentTracker: input.documentTracker,
          locations: {
            connect: input.location.map((loc) => ({ id: loc.id })), 
          },
        },
        include: {
          locations: true, 
        },
      });
    }),
updateHistory: protectedProcedure
.input(
    z.object({
        id: z.string(),
      user: z.string(),
      dateFrom: z.string(),
      dateTo: z.string(),
      location: z.array(
        z.object({
          id: z.number(), // Ensure this ID corresponds to the location table's ID field
          name: z.string(),
        })
      ),
      purpose: z.string(),
      documentTracker: z.string(),
    })
  )
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.records.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("History Does not Exist")
        }
        return await ctx.db.records.update({
            where: {id: input.id},
            data: {
                dateFrom: new Date(input.dateFrom),
                dateTo: new Date(input.dateTo),
                purpose: input.purpose,
                documentTracker: input.documentTracker,
                locations: {
                  connect: input.location.map((loc) => ({ id: loc.id })), 
                },
            }
        })
    }),
deleteHistory: protectedProcedure
.input(
    z.object({
        id: z.string(),
    })
  )
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.records.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("History Does not Exist")
        }
        return await ctx.db.records.delete({
            where: {id: input.id},
        })
    }),
})


