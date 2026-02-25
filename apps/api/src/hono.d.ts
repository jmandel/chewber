import type { Database } from "bun:sqlite";
import type { Env } from "./env";

declare module "hono" {
  interface ContextVariableMap {
    db: Database;
    env: Env;
  }
}
