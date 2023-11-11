import { router } from "../t.js";
import { apiRouter } from "./api.js";
import { fileRouter } from "./file.js";

export const appRouter = router({
  apt: apiRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
