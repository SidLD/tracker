import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import bcrypt from 'bcrypt';
export const userRouter = createTRPCRouter({  
getUsers: protectedProcedure
    .query(async({ ctx, input }) => {
        const users = await ctx.db.user.findMany({
            where: {
                name: null,
            },
            select: { 
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                title: true,
                extension: true,
                updatedAt: true,
                statustype: {
                    select: {
                        id: true,
                        name:true
                    }
                },
                record: {
                    select: {
                        locations: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        dateFrom: true,
                        dateTo: true,
                        fundSource: true,
                        purpose: true,
                        documentTracker:true
                    },
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    take: 1
                }
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
        status: z.string()
    }))
    .mutation(async({ ctx, input }) => {
        const roleFound = await ctx.db.user.findFirst({
            where: { firstName: input.firstName , lastName: input.lastName}
        })
        if(roleFound){
            throw Error("User Already Exist")
        }
        const password = await bcrypt.hash(`password`, 10)
        console.log("data ine ",{
            firstName: input.firstName,
            lastName: input.lastName,
            middleName: input.middleName,
            title: input.title,
            password: password,
            statusId: parseInt(input.status)     
        })
        return await ctx.db.user.create({
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName,
                title: input.title,
                password: password,
                statusId: parseInt(input.status)     
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
        status: z.string().min(1, 'Status is Required'),
    }))
    .mutation(async({ ctx, input }) => {
        const userFound = await ctx.db.user.findFirst({
            where: { id: input.id}
        })

        if(!userFound){
            throw Error("User Does Not Exist")
        }
        return await ctx.db.user.update({
            where: {id: input.id},
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName,
                title: input.title,
                statusId: parseInt(input.status),                 
            },
            select: {
                id: true
            }
        })
    }),
deletUser: protectedProcedure
    .input(z.object({ 
        id: z.string(),
    }))
    .mutation(async({ ctx, input }) => {
        const userFound = await ctx.db.user.findFirst({
            where: { id: input.id}
        })

        if(!userFound){
            throw Error("User Does Not Exist")
        }
        return await ctx.db.user.delete({
            where: {id: input.id}
        })
    })
})


