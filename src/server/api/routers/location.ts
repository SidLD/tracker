import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const locationRouter = createTRPCRouter({  
getLocation: protectedProcedure
    .query(async({ ctx, input }) => {
        const locations = await ctx.db.locations.findMany({})
        return locations;
    }),
createLocation: protectedProcedure
    .input(z.object({ 
        name: z.string()
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.locations.findFirst({
        where: { name: input.name}
        })
        if(roleFound){
            throw Error("Role Already Exist")
        }
        
        return await ctx.db.locations.create({
            data: {
                name: input.name,
            }
        })
    }),
updateLocation: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.locations.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.locations.update({
            where: {id: input.id},
            data: {
                name: input.name,
            }
        })
    }),
deleteLocation: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.locations.findFirst({
            where: { name: input.name}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.locations.delete({
            where: {id: input.id},
        })
    }),
})


