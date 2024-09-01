/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from 'bcrypt';
export const userRouter = createTRPCRouter({  
getUsers: protectedProcedure
    .query(async({ ctx, input }) => {
        const users = await ctx.db.user.findMany({
            where: {
              name: {
                equals: null,
              },
            },
            select: { 
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                title: true,
                extension: true,
                role: true,
                updatedAt: true
            },
          });
          
        return users;
    }),
createUser: protectedProcedure
    .input(z.object({ 
        title: z.string().optional(),
        firstName: z.string().min(3, 'Min 3'),
        middleName: z.string().optional(),
        lastName: z.string().min(3, 'Min 3'),
        role: z.string().min(1, 'Role is Required'),
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.user.findFirst({
        where: { firstName: input.firstName , lastName: input.lastName}
        })
        if(roleFound){
            throw Error("User Already Exist")
        }
        const password = await bcrypt.hash(`${input.firstName}${input.role}`, 10)
        return await ctx.db.user.create({
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName,
                title: input.title,
                roleId: parseInt(input.role),
                password: password                      
            }
        })
    }),
updateUser: protectedProcedure
    .input(z.object({ 
        id: z.string(),
        title: z.string().optional(),
        firstName: z.string().min(3, 'Min 3'),
        middleName: z.string().optional(),
        lastName: z.string().min(3, 'Min 3'),
        role: z.string().min(1, 'Role is Required'),
    }))
    .mutation(async({ ctx, input }) => {
        const userFound = await ctx.db.user.findFirst({
            where: { id: input.id}
        })
        if(!userFound){
            throw Error("User Already Exist")
        }
        return await ctx.db.user.update({
            where: {id: input.id},
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName,
                title: input.title,
                roleId: parseInt(input.role),                 
            },
            select: {
                id: true
            }
        })
    })
})


