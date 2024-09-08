import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { ApiError } from "next/dist/server/api-utils";
import { TRPCError } from "@trpc/server";

export const statustypeRouter = createTRPCRouter({  
getStatusTypes: protectedProcedure
    .input(z.object({
        status: z.number()
    }))
    .query(async({ ctx, input }) => {
        const locationCategory = await ctx.db.statusCategory.findMany({
            where: {
                statusId: input.status
            }
        })
        return locationCategory;
    }),
createStatusTypes: protectedProcedure
        .input(z.object({
            id: z.any().optional(),
            status: z.number(),
            name: z.string()
        }))
        .mutation(async({ ctx, input }) => {
            console.log('test',input)
        const checkDestination = await ctx.db.statusCategory.findFirst({
            where: {
                statusId: input.status,
                name: input.name
            }
        })
        if(checkDestination){
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Category already Exist',
              });
        }
        return await ctx.db.statusCategory.upsert({
            where: {
                id: input?.id || 0
            },
            update: {
                name: input.name,
                statusId: input.status
            },
            create: {
                name: input.name,
                statusId: input.status
            }
        })
    }),
deleteStatusType: protectedProcedure
        .input(z.object({
            id: z.any()
        }))
        .mutation(async({ ctx, input }) => {
        return await ctx.db.statusCategory.delete({
            where: {id: input.id},
        })
    }),
})


