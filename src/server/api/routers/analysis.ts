import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const analysisRouter = createTRPCRouter({  
getAnalysis: protectedProcedure
    .query(async({ ctx , input}) => {
        const userCount = await ctx.db.user.count()
        const numberOfLocation = await ctx.db.locationCategory.count()
        return {
            userCount: userCount-1,
            locationCount: numberOfLocation
        };
    }),
getMonthRecords : protectedProcedure
    .input(
        z.object({
            month: z.string({
              message: "Month should be in 'YYYY-MM' format"
            }), 
        })
    )
    .query(async ({ ctx, input }) => {
        const [year, month] = input.month.split('-').map(Number);
        if(year && month){
            const startDate = new Date(year, month - 1, 1).toISOString();
            const endDate = new Date(year, month, 0).toISOString(); 
            const records = await ctx.db.records.findMany({
                where: {
                    dateFrom: {
                        gte: startDate,
                    },
                    dateTo: {
                        lt: endDate,
                    }
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            statustype: {
                                select: {
                                    name: true,
                                    id: true
                                }
                            }
                        }
                    },
                    locations: {
                        select: {
                            location: {
                                select: {
                                    name: true,
                                    destinations: {
                                        select: {
                                            name: true,
                                            id: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            });
        return records;
        }else{
            return []
        }
    }),
records : protectedProcedure
    .input(
        z.object({
            month: z.string({
              message: "Month should be in 'YYYY-MM' format"
            }), 
        })
    )
    .query(async ({ ctx, input }) => {
        console.log("test", input)
        const year = input.month.split('-').map(Number)[0];
        const month = input.month.split('-').map(Number)[1];
        if(year && month){
            const startDate = new Date(year, month - 1, 1).toISOString();
            const endDate = new Date(year, month, 0).toISOString(); 
            const records = await ctx.db.records.findMany({
                where: {
                    dateFrom: {
                        gte: startDate,
                    },
                    dateTo: {
                        lt: endDate,
                    }
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            statustype: {
                                select: {
                                    name: true,
                                    id: true
                                }
                            },
                            title: true,
                        }
                    },
                    locations: {
                        select: {
                            location: {
                                select: {
                                    name: true,
                                    destinations: {
                                        select: {
                                            name: true,
                                            id: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            });
        return records;
        }else{
            return []
        }
    })
})
