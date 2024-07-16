import express from "express";
import { createServer } from "http";
import { createWSServer } from "./src/ws/index.server";
// @ts-ignore
import { handler } from "./build/handler.js";

const port = process.env.PORT || 5185;
const app = express();
const server = createServer(app);
createWSServer(server);

// SvelteKit should handle everything else using Express middleware
app.use(handler);

server.listen(port);
