/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const historyRouter = createTRPCRouter({  
getHistory: protectedProcedure
    .query(async({ ctx, input }) => {
        const records = await ctx.db.records.findMany({})
        return records;
    }),
ceateHistory: protectedProcedure
    .input(z.object({ 
        name: z.string()
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.records.findFirst({
        })
        if(roleFound){
            throw Error("Role Already Exist")
        }
        // return await ctx.db.records.create({
        // })
    }),
updateHistory: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.records.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        // return await ctx.db.records.update({
        //     where: {id: input.id},
        //     data: {
        //         name: input.name,
        //     }
        // })
    }),
deleteHistory: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        // const roleFound = await ctx.db.records.findFirst({
        //     where: { name: input.name}
        // })
        // if(!roleFound){
        //     throw Error("Role Does not Exist")
        // }
        // return await ctx.db.records.delete({
        //     where: {id: input.id},
        // })
    }),
})


