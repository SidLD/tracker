
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authenticationRouter } from "./routers/authentication";
import { roleRouter } from "./routers/role";
import { locationRouter } from "./routers/location";
import { statusRouter } from "./routers/status";
import { userRouter } from "./routers/user";
import { historyRouter } from "./routers/history";
import { analysisRouter } from "./routers/analysis";
import { destinationRouter } from "./routers/destination";
import { statustypeRouter } from "./routers/statustype";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  authentication: authenticationRouter,
  role: roleRouter,
  location: locationRouter,
  status: statusRouter,
  user: userRouter,
  history: historyRouter,
  analysis: analysisRouter,
  destination: destinationRouter,
  statustype: statustypeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
