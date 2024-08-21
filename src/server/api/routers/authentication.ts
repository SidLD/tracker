/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import bcrypt from 'bcrypt';

export const authenticationRouter = createTRPCRouter({  
login: publicProcedure
    .input(z.object({ 
        username: z.string(),
        password: z.string()
    }))
    .query(async({ ctx, input }) => {
        const userFound = await ctx.db.user.findFirst({
           where: { name: input.username}
        })
        if(userFound && bcrypt.compareSync(input.password, userFound.password)){
            return {
                ...userFound
            }
        } else {
            return null
        }
    }),
register: publicProcedure
    .input(z.object({ 
        username: z.string().min(3, {
            message: "Username must be at least 5 characters.",
        }),
        firstName: z.string().min(3, {
        message: "First name must be at least 5 characters.",
        }),
        middleName: z.string().optional(),
        lastName: z.string().min(3, {
        message: "Last name must be at least 5 characters.",
        }),
        password: z.string().min(8, {
        message: "Username must be at least 8 characters.",
        }),
        extension: z.string().optional(),
        title: z.string().optional(),
        role: z.any()
    }))
    .mutation(async({ ctx, input }) => {
        const userFound = await ctx.db.user.findFirst({
        where: { name: input.username}
        })
        if(userFound){
            throw Error("User Already Exist")
        }
        const hashedPassword = await bcrypt.hash(input.password, 10)
        return await ctx.db.user.create({
            data: {
                name: input.username,
                firstName: input.firstName,
                lastName: input.lastName,
                middleName: input.middleName,
                extension: input.extension,
                title: input.title,
                password: hashedPassword,
                roleId: 1
            }
        })
    })
})