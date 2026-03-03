# Deduplicate Categories

Periodic maintenance task: find and merge duplicate/near-duplicate slugs in
the `categories` table. Duplicates arise because the LLM mints new slugs
during food abstraction and sometimes creates pluralized or synonymous
variants of existing ones.

## What counts as a duplicate

- Singular/plural variants: `biscuit` / `biscuits`, `snack` / `snacks`
- Synonym pairs: `chinese-cuisine` / `chinese-food`, `keto` / `keto-friendly`
- Same display_name on different slugs

## How to merge

For each duplicate pair, pick one **canonical slug** (prefer the one with
more food references, or the singular form, or whichever has a parent_slug
already set). Then:

1. **Retarget children**: Update any `categories.parent_slug` pointing at
   the retired slug to point at the canonical slug.
2. **Retarget food tags**: In `foods.tags_json`, replace the retired slug
   with the canonical slug (skip if canonical is already present).
3. **Rebuild FTS**: After updating `tags_json`, the FTS triggers fire
   automatically on UPDATE, so no manual FTS rebuild is needed.
4. **Delete the retired slug** from `categories`.

## After merging

```bash
# Restart the server to pick up cache changes
sudo systemctl restart chewber
```

If score distribution or tag counts look off, the `/api/categories/tree`
endpoint rebuilds on every request from live data — no cache to bust.

## How to find duplicates

```sql
-- Pluralization variants
SELECT c1.slug, c2.slug
FROM categories c1 JOIN categories c2 ON c2.slug > c1.slug
WHERE c1.slug || 's' = c2.slug
   OR c1.slug || 'es' = c2.slug;

-- Same display_name
SELECT c1.slug, c2.slug, c1.display_name
FROM categories c1 JOIN categories c2 ON c2.slug > c1.slug
WHERE c1.display_name = c2.display_name;
```

## Script

`apps/api/src/scripts/deduplicateCategories.ts` automates the full merge.
Usage:

```bash
# Preview what would change
bun run apps/api/src/scripts/deduplicateCategories.ts --dry-run

# Execute merges
bun run apps/api/src/scripts/deduplicateCategories.ts

# Then restart
sudo systemctl restart chewber
```

The script defines a `MERGES` array at the top — edit it to add new pairs
as duplicates are discovered.
