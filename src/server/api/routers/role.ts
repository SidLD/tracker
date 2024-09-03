import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const roleRouter = createTRPCRouter({  
getRole: protectedProcedure
    .query(async({ ctx, input }) => {
        const roles = await ctx.db.roles.findMany({
            where: {
                NOT: {
                    name: 'admin'
                }
            }
        })
        return roles;
    }),
createRole: protectedProcedure
    .input(z.object({ 
        name: z.string()
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.roles.findFirst({
        where: { name: input.name}
        })
        if(roleFound){
            throw Error("Role Already Exist")
        }
        return await ctx.db.roles.create({
            data: {
                name: input.name,
            }
        })
    }),
updateRole: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.roles.findFirst({
            where: { id: input.id}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.roles.update({
            where: {id: input.id},
            data: {
                name: input.name,
            }
        })
    }),
deleteRole: protectedProcedure
    .input(z.object({ 
        id: z.any(),
        name: z.string().min(3, {
            message: "name must be at least 5 characters.",
        })
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.roles.findFirst({
            where: { name: input.name}
        })
        if(!roleFound){
            throw Error("Role Does not Exist")
        }
        return await ctx.db.roles.delete({
            where: {id: input.id},
        })
    }),
})


