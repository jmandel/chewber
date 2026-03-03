import { z } from "zod";

// ════════════════════════════════════════════════════════════════════
// FoodAbstractionSchema — SINGLE SOURCE OF TRUTH
//
// This file defines:
//   1. Runtime validation (Zod .parse())
//   2. LLM structured-output schema (via zod-to-json-schema)
//   3. LLM extraction instructions (this file is injected as text
//      into the report→JSON prompt, so comments here ARE the docs)
//
// When you add/change a field, update the comments — they teach the
// LLM how to populate it. No other file needs to change.
// ════════════════════════════════════════════════════════════════════

export const FoodAbstractionSchema = z.object({
  schema_version: z.literal(1),

  // A single Zagat-style summary sentence (20-140 chars). REQUIRED, never null.
  // Extract from the "Zagat line" section of the report. If the report omits
  // it, compose one: vivid, opinionated, present tense, punchy voice
  // describing taste, quality, and health profile.
  // Examples:
  //   "Creamy and satisfying with clean ingredients, this Greek yogurt is a protein powerhouse."
  //   "Addictive crunch meets a sodium wallop and a chemistry set of additives."
  zagat_line: z.string().min(1),

  identification: z.object({
    // canonical_name rules:
    //   - Strip "Organic" — tracked separately in the organic field
    //   - Strip generic food-category suffixes that duplicate the category
    //     (e.g. "Breakfast Cereal", "Snack Chips") UNLESS removing them
    //     makes the name unrecognizable
    //   - Keep brand product-line or variant names
    //     ("Simply Naked Pita Chips" ✓, "Honey Nut Cheerios" ✓)
    //   - Title Case, 1-5 words preferred, no ALL CAPS, no package sizes
    canonical_name: z.string(),
    // Use the brand from the input query. If query has no brand, set null.
    // Do NOT invent or guess a brand.
    brand: z.string().nullable(),
    // Use the barcode from the input query. If no barcode, set null.
    // Do NOT use a barcode found for a different product during research.
    barcode: z.string().nullable(),
    kind: z.enum(["prepared", "natural", "unknown"]),
    market_country: z.string().nullable(),
    language: z.string().nullable()
  }),

  classification: z.object({
    nutri_score_category: z.enum(["general_food", "beverage", "added_fat", "cheese", "unknown"]),
    is_water: z.boolean(),
    is_reconstituted: z.boolean(),
    prepared_basis: z.enum(["as_sold", "as_prepared", "unknown"]),
    // Percent fruit, vegetables, pulses, nuts, and certain oils (0-100).
    fvp_percent: z.number().min(0).max(100).nullable()
  }),

  // All values per 100 g (foods) or per 100 mL (beverages).
  // Use null for unknown values — do NOT fill gaps from training knowledge.
  // If the report provides sodium OR salt, fill both when possible:
  //   sodium_mg = (salt_g / 2.5) * 1000
  //   salt_g = (sodium_mg / 1000) * 2.5
  nutrition_per_100: z.object({
    // per_100ml for beverages, per_100g otherwise
    unit_basis: z.enum(["per_100g", "per_100ml", "unknown"]),
    energy_kj: z.number().min(0).nullable(),
    energy_kcal: z.number().min(0).nullable().optional(),
    sugars_g: z.number().min(0).nullable(),
    saturated_fat_g: z.number().min(0).nullable(),
    total_fat_g: z.number().min(0).nullable(),
    // Total carbohydrates in grams. ALWAYS extract this — it appears on
    // every US/EU nutrition label as "Total Carbohydrate". Must be >= sugars_g.
    // This field is REQUIRED (not optional). Set to null only if truly unknown.
    carbohydrates_g: z.number().min(0).nullable(),
    sodium_mg: z.number().min(0).nullable(),
    salt_g: z.number().min(0).nullable(),
    protein_g: z.number().min(0).nullable(),
    fiber_g: z.number().min(0).nullable()
  }),

  ingredients: z.object({
    // Raw ingredient string exactly as it appears on the label / in the report.
    ingredients_text: z.string().nullable(),
    // Ordered array of individual ingredient names parsed from ingredients_text.
    //   - Split by commas at TOP level only (keep sub-ingredients inside parens)
    //   - Normalize to Title Case
    //   - "Tomato Puree (Water, Tomato Paste)" is ONE entry
    //   - For natural foods with no ingredient list, use []
    ingredients_list: z.array(z.string()).optional().default([])
  }),

  // One object per additive detected in the research report.
  additives: z.array(
    z.object({
      // Bare E-number format: "E322", "E330", "E150d"
      //   NOT "en:e322", NOT "e322-lecithins", NOT "E322I" (use base "E322")
      //   If no E-number can be determined (e.g. "Natural Flavors"), set null
      code: z.string().nullable(),
      name: z.string().nullable(),
      // label = from ingredient list, database = from OFF, inferred = agent reasoning
      detection: z.enum(["label", "database", "inferred", "unknown"])
    })
  ),

  flags: z.object({
    contains_partially_hydrogenated_oils: z.enum(["yes", "no", "unknown"]),
    contains_fully_hydrogenated_oils: z.enum(["yes", "no", "unknown"])
  }),

  organic: z.object({
    is_certified_organic: z.enum(["yes", "no", "unknown"]),
    evidence: z.string().nullable()
  }),

  // 2-12 semantic tags describing WHAT this food IS or its key attributes.
  // Lowercase kebab-case (e.g. "breakfast-cereal", "condiment", "gluten-free").
  //
  // IMPORTANT: The system prompt lists all existing category slugs.
  // You MUST reuse existing slugs whenever they fit — do NOT invent synonyms
  // for categories that already exist (e.g. don’t create "biscuits" if "biscuit" exists).
  //
  // If you genuinely need a NEW slug that doesn’t exist yet, add it to
  // `new_categories` below so it gets properly registered.
  //
  // Do NOT include nutrition-level slugs ("high-protein", "low-sugar") —
  //   those are computed automatically from the numbers.
  // Do NOT include "organic" or "conventional" — tracked separately.
  categories: z.array(z.string()).min(1).max(12),

  // Declare any brand-new category slugs that you used in `categories`
  // which do NOT appear in the existing categories list from the system prompt.
  // Leave empty [] if all slugs were reused from the existing list.
  //
  // EVERY slug in `categories` that is not in the existing list MUST have
  // a corresponding entry here. If you forget, it will be flagged.
  //
  // Each entry must specify:
  //   - slug: the new kebab-case slug (must also appear in `categories` above)
  //   - kind: "category" if it names a food TYPE (crackers, yogurt, soda);
  //           "trait" if it names an attribute/modifier (spicy, fermented, keto)
  //   - parent_slug: the most specific EXISTING slug this falls under, or null
  //     e.g. "corn-chips" → parent "salty-snacks"; "greek-yogurt" → parent "yogurt"
  //   - display_name: Title Case human label (1-4 words)
  //   - description: One sentence (under 80 chars) explaining what this tag covers
  new_categories: z.array(z.object({
    slug: z.string(),
    kind: z.enum(["category", "trait"]),
    parent_slug: z.string().nullable(),
    display_name: z.string(),
    description: z.string(),
  })).default([]),

  // All URLs found in the Sources section of the report.
  sources: z.array(
    z.object({
      url: z.string(),
      title: z.string().nullable()
    })
  ),

  notes: z.object({
    confidence: z.number().min(0).max(1),
    rationale: z.string().nullable(),
    missing_fields: z.array(z.string())
  }),

  // scoring_track: "standard" for normal foods, "not_rated" for alcohol,
  //   infant formula, pure sugar/sweeteners, protein supplements.
  // not_rated_reason: null if standard, otherwise brief explanation.
  eligibility: z.object({
    scoring_track: z.enum(["standard", "not_rated"]),
    not_rated_reason: z.string().nullable()
  }),
});

export type FoodAbstraction = z.infer<typeof FoodAbstractionSchema>;
