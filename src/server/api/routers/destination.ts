import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const destinationRouter = createTRPCRouter({  
getDestination: protectedProcedure
    .input(z.object({
        location: z.number()
    }))
    .query(async({ ctx, input }) => {
        const locationCategory = await ctx.db.locationCategory.findMany({
            where: {
                locationId: input.location
            }
        })
        return locationCategory;
    }),
createDestination: protectedProcedure
        .input(z.object({
            id: z.any().optional(),
            location: z.number(),
            name: z.string()
        }))
        .mutation(async({ ctx, input }) => {
        const checkDestination = await ctx.db.locationCategory.findFirst({
            where: {
                locationId: input?.location,
                name: input.name
            }
        })
        if(checkDestination){
            throw Error("Category Does Exist")
        }
        return await ctx.db.locationCategory.upsert({
            where: {
                id: input?.id || 0
            },
            update: {
                name: input.name,
                locationId: input.location
            },
            create: {
                name: input.name,
                locationId: input.location
            }
        })
    }),
deleteDestination: protectedProcedure
        .input(z.object({
            id: z.any(),
        }))
        .mutation(async({ ctx, input }) => {
        return await ctx.db.locationCategory.delete({
            where: {id: input.id},
        })
    }),
})


