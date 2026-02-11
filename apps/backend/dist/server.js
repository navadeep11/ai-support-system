import { serve } from "@hono/node-server";
import app from "./app.js";
const port = 4000;
serve({
    fetch: app.fetch,
    port,
});
console.log(`🚀 Server running on http://localhost:${port}`);
