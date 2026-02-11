import { Context, Next } from "hono";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (err: any) {
    console.error("Server Error:", err);

    return c.json(
      {
        success: false,
        message: err?.message || "Internal Server Error"
      },
      err?.status || 500
    );
  }
}
