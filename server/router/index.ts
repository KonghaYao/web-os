import { router } from "../t.ts";
import { apiRouter } from "./api.ts";

export const appRouter = router({
    apt: apiRouter,
});

export type AppRouter = typeof appRouter;
