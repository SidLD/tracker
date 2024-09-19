import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const statusRouter = createTRPCRouter({  
getStatus: protectedProcedure
    .query(async({ ctx, input }) => {
        const status = await ctx.db.status.findMany({})
        return status;
    }),
createStatus: protectedProcedure
    .input(z.object({ 
        name: z.string()
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.status.findFirst({
        where: { name: input.name}
        })
        if(roleFound){
            throw Error("Role Already Exist")
        }
        return await ctx.db.status.create({
            data: {
                name: input.name,
            }
        })
    }),
updateStatus: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.status.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.status.update({
            where: {id: input.id},
            data: {
                name: input.name,
            }
        })
    }),
deleteStatus: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.status.findFirst({
            where: { name: input.name}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.status.delete({
            where: {id: input.id},
        })
    }),
})


