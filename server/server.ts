import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { appRouter } from "./router/index.js";
import { platform } from "os";
import { spawn } from "node-pty";
import Etag from "@fastify/etag";
export interface ServerOptions {
    dev?: boolean;
    port?: number;
    prefix?: string;
}

export async function createServer(opts: ServerOptions) {
    const dev = opts.dev ?? true;
    const port = opts.port ?? 3000;
    const prefix = opts.prefix ?? "/trpc";
    const server = fastify({ logger: dev });
    server.register(Etag);
    server.register(ws, {
        options: { maxPayload: 1048576 },
    });
    server.register(fastifyTRPCPlugin, {
        prefix,
        trpcOptions: { router: appRouter },
    });

    server.register(async (server) => {
        server.get("/", async () => {
            return { hello: "wait-on 💨" };
        });
        server.get("/terminal", { websocket: true }, (connection) => {
            const shell = platform() === "win32" ? "powershell.exe" : "bash";
            const ptyProcess = spawn(shell, [], {
                name: "xterm-color",
                cols: 80,
                rows: 30,
                cwd: process.env.PWD,
                env: process.env,
            });
            ptyProcess.onExit(() => {
                console.log("链接关闭");
                connection.socket.close();
            });
            ptyProcess.onData(function (data) {
                // process.stdout.write(data);
                connection.socket.send(data);
            });
            connection.socket.on("message", (message) => {
                ptyProcess.write(message.toString());
            });
        });
    });
    server.register(await import("./router/file.js").then((res) => res.plugin));

    const stop = async () => {
        await server.close();
    };
    const start = async () => {
        try {
            await server.listen({ port });
            console.log("listening on port", port);
        } catch (err) {
            server.log.error(err);
            console.log("启动失败", err);
            process.exit(1);
        }
    };

    return { server, start, stop };
}
