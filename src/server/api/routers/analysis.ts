import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const analysisRouter = createTRPCRouter({  
getAnalysis: protectedProcedure
    .query(async({ ctx , input}) => {
        const userCount = await ctx.db.user.count()
        
        return {
            userCount: userCount-1
        };
    })
})


