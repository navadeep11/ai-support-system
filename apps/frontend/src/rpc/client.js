import { hc } from "hono/client";

const API_URL = import.meta.env.VITE_API_URL;

export const client = hc(API_URL);
