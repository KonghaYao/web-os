import { z } from "zod";
import { publicProcedure, router } from "../t.js";

export const fileRouter = router({
    home: publicProcedure.query(() => {
        return process.env.HOME
    }),
    hello: publicProcedure
        .input(z.object({ username: z.string().nullish() }).nullish())
        .query(() => {
            return {
                text: `hello world`,
            };
        }),
});
