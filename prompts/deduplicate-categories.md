# Deduplicate Categories

Periodic maintenance task: find and merge duplicate/near-duplicate slugs in
the `categories` table (in `data/chewber.sqlite`). Duplicates arise because
the LLM mints new slugs during food abstraction and sometimes creates
pluralized or synonymous variants of existing ones.

## Step 1 — Find duplicates

Run these queries from the repo root to discover candidates:

```bash
# Pluralization variants (slug vs slug + 's' or 'es')
sqlite3 data/chewber.sqlite "
  SELECT c1.slug, c2.slug,
    (SELECT COUNT(*) FROM foods f WHERE EXISTS (SELECT 1 FROM json_each(f.tags_json) WHERE value = c1.slug)) as cnt1,
    (SELECT COUNT(*) FROM foods f WHERE EXISTS (SELECT 1 FROM json_each(f.tags_json) WHERE value = c2.slug)) as cnt2
  FROM categories c1 JOIN categories c2 ON c2.slug > c1.slug
  WHERE c1.slug || 's' = c2.slug
     OR c1.slug || 'es' = c2.slug
  ORDER BY c1.slug;
"

# Same display_name on different slugs
sqlite3 data/chewber.sqlite "
  SELECT c1.slug, c2.slug, c1.display_name,
    (SELECT COUNT(*) FROM foods f WHERE EXISTS (SELECT 1 FROM json_each(f.tags_json) WHERE value = c1.slug)) as cnt1,
    (SELECT COUNT(*) FROM foods f WHERE EXISTS (SELECT 1 FROM json_each(f.tags_json) WHERE value = c2.slug)) as cnt2
  FROM categories c1 JOIN categories c2 ON c2.slug > c1.slug
  WHERE c1.display_name = c2.display_name
  ORDER BY c1.display_name;
"

# Check which slugs are parents (children depend on them)
sqlite3 data/chewber.sqlite "
  SELECT parent_slug, GROUP_CONCAT(slug) as children
  FROM categories
  WHERE parent_slug IN (
    -- paste the slugs you're considering retiring
  )
  GROUP BY parent_slug;
"
```

## Step 2 — What counts as a duplicate

- Singular/plural variants: `biscuit` / `biscuits`, `snack` / `snacks`
- Synonym pairs: `chinese-cuisine` / `chinese-food`, `keto` / `keto-friendly`
- Same display_name on different slugs

## Step 3 — Choose the canonical slug

For each pair, pick one slug to **keep** and one to **retire**. Prefer:
- The slug with more food references (higher cnt)
- The slug that has children (`parent_slug` references pointing at it)
- The singular form (unless plural is already dominant)
- The shorter/more-standard form

## Step 4 — Edit the merge script

Open `apps/api/src/scripts/deduplicateCategories.ts` and add entries to the
`MERGES` array near the top:

```typescript
const MERGES: [keep: string, retire: string][] = [
  ["biscuits",  "biscuit"],   // biscuits has 3 foods + children
  ["snacks",    "snack"],     // snacks has children (salty-snacks etc)
  // ... add new pairs here
];
```

## Step 5 — Preview and execute

```bash
# Preview what would change (no writes)
bun run apps/api/src/scripts/deduplicateCategories.ts --dry-run

# Execute the merges
bun run apps/api/src/scripts/deduplicateCategories.ts
```

The script does four things per pair:
1. **Retargets children** — any `categories.parent_slug` pointing at the
   retired slug is updated to point at the canonical slug.
2. **Rewrites food tags** — in `foods.tags_json`, replaces the retired slug
   with the canonical slug (dedupes if both are present). FTS triggers fire
   automatically on UPDATE.
3. **Copies metadata** — if the canonical slug has an empty description but
   the retired one doesn't, copies it over.
4. **Deletes the retired row** from `categories`.

## Step 6 — Restart and verify

```bash
# Restart server to clear any in-memory caches
sudo systemctl restart chewber

# Verify no duplicates remain
sqlite3 data/chewber.sqlite "
  SELECT c1.slug, c2.slug
  FROM categories c1 JOIN categories c2 ON c2.slug > c1.slug
  WHERE c1.slug || 's' = c2.slug
     OR c1.slug || 'es' = c2.slug
     OR c1.display_name = c2.display_name;
"
# Should return empty

# Check final counts
sqlite3 data/chewber.sqlite "
  SELECT kind, COUNT(*) FROM categories GROUP BY kind;
"
```

## Step 7 — Update the seed file

After merging, regenerate the seed classifications so fresh DBs start clean:

```bash
python3 -c "
import sqlite3, json
conn = sqlite3.connect('data/chewber.sqlite')
rows = conn.execute('SELECT slug, kind, parent_slug FROM categories ORDER BY slug').fetchall()
data = [{'slug': r[0], 'kind': r[1], 'parent_slug': r[2]} for r in rows]
with open('apps/api/src/scripts/tag_classifications.json', 'w') as f:
    json.dump(data, f, indent=2)
print(f'Wrote {len(data)} entries')
"
```

Then commit the updated `tag_classifications.json`.

## Notes

- The `/api/categories/tree` endpoint rebuilds from live data on every
  request — no tree cache to bust.
- If score distribution or tag counts look off after merging, the data is
  correct; it's just the browser cache. Hard-refresh the page.
- The `classifyTags.ts` script handles the separate concern of classifying
  `kind='unclassified'` tags — run it if you see unclassified entries:
  ```bash
  bun run apps/api/src/scripts/classifyTags.ts
  ```
