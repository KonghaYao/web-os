import { z } from "zod";
import { publicProcedure, router } from "../t.js";
import fs from 'fs-extra'
import path from 'path'

/** 以分页的方式查看文件夹 */
const viewDir = async (dir: string, query: { page: number }) => {
    const list = (await fs.readdir(dir))
    const slice = await Promise.all(list.slice(query.page * 10, (query.page + 1) * 10).map(async i => {
        const stat = await fs.stat(path.join(dir, i))
        return { ...stat, isFile: stat.isFile(), isFIFO: stat.isFIFO(), isDirectory: stat.isDirectory(), name: i }
    }))
    return { dir, count: list.length, list: slice };
}



export const fileRouter = router({
    listDir: publicProcedure.input(z.object({
        page: z.number(),
        dir: z.string()
    }).nullish()).query(async ({ input: { page, dir } }) => {
        return viewDir(dir || process.env.HOME, { page })
    }),
});
