/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const analysisRouter = createTRPCRouter({  
getAnalysis: protectedProcedure
    .query(async({ ctx }) => {
        const userCount = await ctx.db.user.count()
        
        return {
            userCount: userCount-1
        };
    })
})


