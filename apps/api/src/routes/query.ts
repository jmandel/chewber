import { Hono } from "hono";
import { z, ZodError } from "zod";
import { assistQuery } from "../agents/helperAgent";

export const queryRoutes = new Hono();

const BodySchema = z.object({
  rawText: z.string().optional().default(""),
  barcode: z.string().optional(),
  imageIds: z.array(z.string()).optional()
});

queryRoutes.post("/query/assist", async (c) => {
  const body = BodySchema.parse(await c.req.json());

  try {
    const result = await assistQuery({
      rawText: body.rawText ?? "",
      barcode: body.barcode ?? null,
      imageIds: body.imageIds ?? []
    });

    // Ensure imageIds are carried through
    result.structured_query.imageIds = body.imageIds ?? [];

    return c.json(result);
  } catch (e: any) {
    if (e instanceof ZodError) {
      console.error("[query/assist] Zod validation error:", JSON.stringify(e.issues, null, 2));
      return c.json({ error: "LLM response failed validation", issues: e.issues }, 422);
    }
    throw e;
  }
});
