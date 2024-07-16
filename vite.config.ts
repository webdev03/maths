import { sveltekit } from "@sveltejs/kit/vite";
import { type ViteDevServer, defineConfig } from "vite";
import { createWSServer } from "./src/ws/index.server";

const webSocketServer = {
  name: "webSocketServer",
  configureServer(server: ViteDevServer) {
    if (!server.httpServer) return;
    createWSServer(server.httpServer);
  }
};

export default defineConfig({
  plugins: [sveltekit(), webSocketServer]
});
