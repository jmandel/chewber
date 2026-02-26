#!/usr/bin/env bash
set -euo pipefail

DB="${1:-data/usda.sqlite}"

sqlite3 "$DB" <<'SQL'
INSERT OR IGNORE INTO additive_risks (code, name, risk_level, updated_at) VALUES
  ('E150b', 'Caustic sulphite caramel', 'limited', datetime('now')),
  ('E150c', 'Ammonia caramel', 'moderate', datetime('now')),
  ('E150d', 'Sulphite ammonia caramel', 'moderate', datetime('now')),
  ('E319', 'Tertiary butylhydroquinone (TBHQ)', 'high', datetime('now')),
  ('E392', 'Rosemary extract', 'risk_free', datetime('now')),
  ('E1400', 'Dextrin', 'limited', datetime('now')),
  ('E1401', 'Acid-treated starch', 'limited', datetime('now')),
  ('E1402', 'Alkaline-treated starch', 'limited', datetime('now')),
  ('E1403', 'Bleached starch', 'limited', datetime('now')),
  ('E1405', 'Enzyme-treated starch', 'limited', datetime('now')),
  ('E1410', 'Monostarch phosphate', 'limited', datetime('now')),
  ('E1412', 'Distarch phosphate', 'limited', datetime('now')),
  ('E1413', 'Phosphated distarch phosphate', 'limited', datetime('now')),
  ('E1414', 'Acetylated distarch phosphate', 'limited', datetime('now')),
  ('E1420', 'Acetylated starch', 'limited', datetime('now')),
  ('E1422', 'Acetylated distarch adipate', 'limited', datetime('now')),
  ('E1440', 'Hydroxypropyl starch', 'limited', datetime('now')),
  ('E1442', 'Hydroxypropyl distarch phosphate', 'limited', datetime('now')),
  ('E1450', 'Starch sodium octenyl succinate', 'limited', datetime('now')),
  ('E1451', 'Acetylated oxidised starch', 'limited', datetime('now')),
  ('E1452', 'Starch aluminium octenyl succinate', 'limited', datetime('now')),
  ('E322I', 'Lecithin (non-fractionated)', 'limited', datetime('now')),
  ('E322II', 'Partially hydrolysed lecithin', 'limited', datetime('now')),
  ('E950', 'Acesulfame potassium', 'moderate', datetime('now')),
  ('E951', 'Aspartame', 'moderate', datetime('now')),
  ('E952', 'Cyclamic acid', 'high', datetime('now')),
  ('E954', 'Saccharin', 'moderate', datetime('now')),
  ('E955', 'Sucralose', 'moderate', datetime('now')),
  ('E960', 'Steviol glycosides', 'risk_free', datetime('now')),
  ('E171', 'Titanium dioxide', 'high', datetime('now')),
  ('E433', 'Polysorbate 80', 'moderate', datetime('now'));
SQL

echo "✅ Seeded $(sqlite3 "$DB" "SELECT changes()") additive gap entries"
