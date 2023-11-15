import { z } from "zod";
import { publicProcedure, router } from "../t.js";
import fs from "fs-extra";
import path from "path";

/** 以分页的方式查看文件夹 */
const viewDir = async (dir: string, query: { page: number; size: number }) => {
    const list = await fs.readdir(dir);
    const slice = await Promise.all(
        list
            .slice(query.page * query.size, (query.page + 1) * query.size)
            .map(async (i) => {
                try {
                    const stat = await fs.stat(path.join(dir, i));
                    return [
                        {
                            ...stat,
                            isFile: stat.isFile(),
                            isFIFO: stat.isFIFO(),
                            isDirectory: stat.isDirectory(),
                            name: i,
                        },
                    ];
                } catch (e) {
                    return [];
                }
            })
    );
    return { dir, count: list.length, list: slice.flat(), size: query.size };
};

export const fileRouter = router({
    listDir: publicProcedure
        .input(
            z
                .object({
                    page: z.number(),
                    dir: z.string(),
                    size: z.number().optional(),
                })
                .nullish()
        )
        .query(async ({ input: { page, dir, size } }) => {
            return viewDir(dir || process.env.HOME, {
                page,
                size: size ?? 10,
            });
        }),
});
