import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const destinationRouter = createTRPCRouter({  
getDestination: protectedProcedure
    .input(z.object({
        location: z.number()
    }))
    .query(async({ ctx, input }) => {
        if(input.location == 0){
            const locationCategory = await ctx.db.locationCategory.findMany({
                select: {
                    name: true,
                    id: true,
                    location: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })
            return locationCategory;
        }else{
            const locationCategory = await ctx.db.locationCategory.findMany({
                where: {
                    locationId: input.location
                }
            })
            return locationCategory;
        }
    }),
createDestination: protectedProcedure
        .input(z.object({
            id: z.any().optional(),
            location: z.number(),
            name: z.string()
        }))
        .mutation(async({ ctx, input }) => {

        return await ctx.db.locationCategory.upsert({
            where: {
                id: input?.id || 0
            },
            update: {
                name: input.name
            },
            create: {
                name: input.name,
                locationId: input.location,
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


