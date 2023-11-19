import { router } from "../t.js";
import fileRouter from "./file.js";

export const appRouter = router({
    file: fileRouter,
});

export type AppRouter = typeof appRouter;
