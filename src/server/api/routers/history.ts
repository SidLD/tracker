/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
                status: true,
                location: true
            },
            orderBy: {
                dateFrom: "asc"
            }
        })
        return records;
    }),
ceateHistory: protectedProcedure
    .input(z.object({ 
        user : z.string(),
        dateFrom: z.string(),
        dateTo : z.string(),
        status: z.string(), 
        location : z.string()
    }))
    .mutation(async({ ctx, input }) => {
        console.log('test',input)
        return await ctx.db.records.create({
            data: {
                userId: input.user,
                dateFrom: new Date(input.dateFrom),
                dateTo: new Date(input.dateTo),
                statusId: parseInt(input.status),
                locationId: parseInt(input.location)
            }
        })
    }),
updateHistory: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        dateFrom: z.string(),
        dateTo : z.string(),
        status: z.string(), 
        location : z.string()
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.records.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.records.update({
            where: {id: input.id},
            data: {
               dateFrom: input.dateFrom,
               dateTo: input.dateTo,
               statusId: parseInt(input.status),
               locationId: parseInt(input.location)
            }
        })
    }),
deleteHistory: protectedProcedure
    .input(z.object({ 
        id: z.string(),    
    }))
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


