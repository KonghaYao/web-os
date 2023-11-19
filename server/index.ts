import { serverConfig } from "./config.js";
import { createServer } from "./server.js";
createServer(serverConfig).then((server) => {
    void server.start();
});
