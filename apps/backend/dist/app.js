import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { rpc } from "./rpc/index.js";
const app = new Hono();
// basic middleware
app.use("*", cors({
    origin: "*",
}));
// health check
app.get("/health", (c) => {
    return c.json({ status: "ok" });
});
app.route("/rpc", rpc);
export default app;
