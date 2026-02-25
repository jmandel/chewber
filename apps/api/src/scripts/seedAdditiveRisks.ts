import { getDb } from "../db";
import { nowIso } from "../utils/id";

/**
 * Seed the additive risk table with ~230 common E-number food additives.
 * Risk levels based on EFSA/WHO assessments and EFSA risk classification.
 * Re-running is idempotent (INSERT OR REPLACE).
 */
const SEED: Array<{ code: string; name: string; risk_level: "risk_free" | "limited" | "moderate" | "high" }> = [
  // ──────────────────────────────────────────────
  // RISK FREE — well-established safe additives
  // ──────────────────────────────────────────────
  { code: "E100", name: "Curcumin", risk_level: "risk_free" },
  { code: "E101", name: "Riboflavin (Vitamin B2)", risk_level: "risk_free" },
  { code: "E140", name: "Chlorophylls", risk_level: "risk_free" },
  { code: "E141", name: "Copper complexes of chlorophylls", risk_level: "risk_free" },
  { code: "E150a", name: "Plain caramel", risk_level: "risk_free" },
  { code: "E153", name: "Vegetable carbon", risk_level: "risk_free" },
  { code: "E160a", name: "Beta-carotene", risk_level: "risk_free" },
  { code: "E160b", name: "Annatto", risk_level: "risk_free" },
  { code: "E160c", name: "Paprika extract", risk_level: "risk_free" },
  { code: "E160d", name: "Lycopene", risk_level: "risk_free" },
  { code: "E160e", name: "Beta-apo-8'-carotenal", risk_level: "risk_free" },
  { code: "E161b", name: "Lutein", risk_level: "risk_free" },
  { code: "E162", name: "Beetroot red (Betanin)", risk_level: "risk_free" },
  { code: "E163", name: "Anthocyanins", risk_level: "risk_free" },
  { code: "E170", name: "Calcium carbonate", risk_level: "risk_free" },
  { code: "E172", name: "Iron oxides and hydroxides", risk_level: "risk_free" },
  { code: "E174", name: "Silver", risk_level: "risk_free" },
  { code: "E175", name: "Gold", risk_level: "risk_free" },
  { code: "E300", name: "Ascorbic acid (Vitamin C)", risk_level: "risk_free" },
  { code: "E301", name: "Sodium ascorbate", risk_level: "risk_free" },
  { code: "E302", name: "Calcium ascorbate", risk_level: "risk_free" },
  { code: "E303", name: "Potassium ascorbate", risk_level: "risk_free" },
  { code: "E304", name: "Ascorbyl palmitate", risk_level: "risk_free" },
  { code: "E306", name: "Tocopherols (Vitamin E)", risk_level: "risk_free" },
  { code: "E307", name: "Alpha-tocopherol", risk_level: "risk_free" },
  { code: "E308", name: "Gamma-tocopherol", risk_level: "risk_free" },
  { code: "E309", name: "Delta-tocopherol", risk_level: "risk_free" },
  { code: "E330", name: "Citric acid", risk_level: "risk_free" },

  // ──────────────────────────────────────────────
  // HIGH — strong evidence of health concerns
  // ──────────────────────────────────────────────
  // Azo dyes — hyperactivity in children
  { code: "E102", name: "Tartrazine", risk_level: "high" },
  { code: "E110", name: "Sunset Yellow FCF", risk_level: "high" },
  { code: "E122", name: "Azorubine (Carmoisine)", risk_level: "high" },
  { code: "E123", name: "Amaranth", risk_level: "high" },
  { code: "E124", name: "Ponceau 4R", risk_level: "high" },
  { code: "E129", name: "Allura Red AC", risk_level: "high" },
  // Coal tar dyes
  { code: "E151", name: "Brilliant Black BN", risk_level: "high" },
  { code: "E154", name: "Brown FK", risk_level: "high" },
  { code: "E155", name: "Brown HT", risk_level: "high" },
  // Titanium dioxide — banned in EU
  { code: "E171", name: "Titanium dioxide", risk_level: "high" },
  // Aluminium
  { code: "E173", name: "Aluminium", risk_level: "high" },
  // Benzoates — benzene concerns
  { code: "E211", name: "Sodium benzoate", risk_level: "high" },
  { code: "E212", name: "Potassium benzoate", risk_level: "high" },
  { code: "E213", name: "Calcium benzoate", risk_level: "high" },
  // Nitrites/Nitrates — carcinogenic compounds
  { code: "E249", name: "Potassium nitrite", risk_level: "high" },
  { code: "E250", name: "Sodium nitrite", risk_level: "high" },
  { code: "E251", name: "Sodium nitrate", risk_level: "high" },
  { code: "E252", name: "Potassium nitrate", risk_level: "high" },
  // Gallates
  { code: "E310", name: "Propyl gallate", risk_level: "high" },
  { code: "E311", name: "Octyl gallate", risk_level: "high" },
  { code: "E312", name: "Dodecyl gallate", risk_level: "high" },
  // BHA/BHT
  { code: "E320", name: "Butylated hydroxyanisole (BHA)", risk_level: "high" },
  { code: "E321", name: "Butylated hydroxytoluene (BHT)", risk_level: "high" },
  // EDTA
  { code: "E385", name: "Calcium disodium EDTA", risk_level: "high" },
  // Flavor enhancers
  { code: "E621", name: "Monosodium glutamate (MSG)", risk_level: "high" },
  // Artificial sweeteners
  { code: "E950", name: "Acesulfame K", risk_level: "high" },
  { code: "E951", name: "Aspartame", risk_level: "high" },
  { code: "E955", name: "Sucralose", risk_level: "high" },
  // Quillaia extract
  { code: "E999", name: "Quillaia extract", risk_level: "high" },

  // ──────────────────────────────────────────────
  // MODERATE — some evidence of concerns
  // ──────────────────────────────────────────────
  // Sulfites — allergen, asthma trigger
  { code: "E220", name: "Sulfur dioxide", risk_level: "moderate" },
  { code: "E221", name: "Sodium sulfite", risk_level: "moderate" },
  { code: "E222", name: "Sodium hydrogen sulfite", risk_level: "moderate" },
  { code: "E223", name: "Sodium metabisulfite", risk_level: "moderate" },
  { code: "E224", name: "Potassium metabisulfite", risk_level: "moderate" },
  { code: "E225", name: "Potassium sulfite", risk_level: "moderate" },
  { code: "E226", name: "Calcium sulfite", risk_level: "moderate" },
  { code: "E227", name: "Calcium hydrogen sulfite", risk_level: "moderate" },
  { code: "E228", name: "Potassium hydrogen sulfite", risk_level: "moderate" },
  // Fungicides
  { code: "E231", name: "Orthophenyl phenol", risk_level: "moderate" },
  { code: "E232", name: "Sodium orthophenyl phenol", risk_level: "moderate" },
  { code: "E233", name: "Thiabendazole", risk_level: "moderate" },
  // Propionates
  { code: "E280", name: "Propionic acid", risk_level: "moderate" },
  { code: "E281", name: "Sodium propionate", risk_level: "moderate" },
  { code: "E282", name: "Calcium propionate", risk_level: "moderate" },
  { code: "E283", name: "Potassium propionate", risk_level: "moderate" },
  // Phosphates — kidney concerns at high intake
  { code: "E338", name: "Phosphoric acid", risk_level: "moderate" },
  { code: "E339", name: "Sodium phosphates", risk_level: "moderate" },
  { code: "E340", name: "Potassium phosphates", risk_level: "moderate" },
  { code: "E341", name: "Calcium phosphates", risk_level: "moderate" },
  { code: "E343", name: "Magnesium phosphates", risk_level: "moderate" },
  // Carrageenan — GI inflammation concerns
  { code: "E407", name: "Carrageenan", risk_level: "moderate" },
  // Polysorbates
  { code: "E433", name: "Polysorbate 80", risk_level: "moderate" },
  { code: "E435", name: "Polysorbate 60", risk_level: "moderate" },
  { code: "E436", name: "Polysorbate 65", risk_level: "moderate" },
  // Pyrophosphates/Polyphosphates
  { code: "E450", name: "Diphosphates (Pyrophosphates)", risk_level: "moderate" },
  { code: "E451", name: "Triphosphates", risk_level: "moderate" },
  { code: "E452", name: "Polyphosphates", risk_level: "moderate" },
  // Carboxymethyl cellulose
  { code: "E466", name: "Carboxymethyl cellulose", risk_level: "moderate" },
  // Hydrochloric acid
  { code: "E507", name: "Hydrochloric acid", risk_level: "moderate" },
  // Potassium chloride
  { code: "E508", name: "Potassium chloride", risk_level: "moderate" },
  // Glutamates (other than MSG)
  { code: "E620", name: "Glutamic acid", risk_level: "moderate" },
  { code: "E622", name: "Monopotassium glutamate", risk_level: "moderate" },
  { code: "E623", name: "Calcium diglutamate", risk_level: "moderate" },
  { code: "E624", name: "Monoammonium glutamate", risk_level: "moderate" },
  { code: "E625", name: "Magnesium diglutamate", risk_level: "moderate" },
  // Nucleotides — flavor enhancers
  { code: "E627", name: "Disodium guanylate", risk_level: "moderate" },
  { code: "E631", name: "Disodium inosinate", risk_level: "moderate" },
  { code: "E635", name: "Disodium 5'-ribonucleotides", risk_level: "moderate" },
  // Dimethylpolysiloxane
  { code: "E900", name: "Dimethylpolysiloxane", risk_level: "moderate" },

  // ──────────────────────────────────────────────
  // LIMITED — generally safe but some caution
  // ──────────────────────────────────────────────
  // Sorbic acid/sorbates
  { code: "E200", name: "Sorbic acid", risk_level: "limited" },
  { code: "E201", name: "Sodium sorbate", risk_level: "limited" },
  { code: "E202", name: "Potassium sorbate", risk_level: "limited" },
  { code: "E203", name: "Calcium sorbate", risk_level: "limited" },
  // Benzoic acid
  { code: "E210", name: "Benzoic acid", risk_level: "limited" },
  // Parabens
  { code: "E214", name: "Ethyl p-hydroxybenzoate", risk_level: "limited" },
  { code: "E215", name: "Sodium ethyl p-hydroxybenzoate", risk_level: "limited" },
  { code: "E216", name: "Propyl p-hydroxybenzoate", risk_level: "limited" },
  { code: "E217", name: "Sodium propyl p-hydroxybenzoate", risk_level: "limited" },
  { code: "E218", name: "Methyl p-hydroxybenzoate", risk_level: "limited" },
  { code: "E219", name: "Sodium methyl p-hydroxybenzoate", risk_level: "limited" },
  // Nisin
  { code: "E234", name: "Nisin", risk_level: "limited" },
  // Acetic acid/acetates
  { code: "E260", name: "Acetic acid", risk_level: "limited" },
  { code: "E261", name: "Potassium acetate", risk_level: "limited" },
  { code: "E262", name: "Sodium acetates", risk_level: "limited" },
  { code: "E263", name: "Calcium acetate", risk_level: "limited" },
  // Lactic acid
  { code: "E270", name: "Lactic acid", risk_level: "limited" },
  // Carbon dioxide
  { code: "E290", name: "Carbon dioxide", risk_level: "limited" },
  // Malic acid
  { code: "E296", name: "Malic acid", risk_level: "limited" },
  // Fumaric acid
  { code: "E297", name: "Fumaric acid", risk_level: "limited" },
  // Lecithin
  { code: "E322", name: "Lecithin", risk_level: "limited" },
  // Lactates
  { code: "E325", name: "Sodium lactate", risk_level: "limited" },
  { code: "E326", name: "Potassium lactate", risk_level: "limited" },
  { code: "E327", name: "Calcium lactate", risk_level: "limited" },
  // Citrates
  { code: "E331", name: "Sodium citrates", risk_level: "limited" },
  { code: "E332", name: "Potassium citrates", risk_level: "limited" },
  { code: "E333", name: "Calcium citrates", risk_level: "limited" },
  // Tartrates
  { code: "E334", name: "Tartaric acid", risk_level: "limited" },
  { code: "E335", name: "Sodium tartrates", risk_level: "limited" },
  { code: "E336", name: "Potassium tartrates (Cream of tartar)", risk_level: "limited" },
  { code: "E337", name: "Sodium potassium tartrate", risk_level: "limited" },
  // Malates
  { code: "E350", name: "Sodium malates", risk_level: "limited" },
  { code: "E351", name: "Potassium malate", risk_level: "limited" },
  { code: "E352", name: "Calcium malates", risk_level: "limited" },
  // Adipates
  { code: "E355", name: "Adipic acid", risk_level: "limited" },
  { code: "E356", name: "Sodium adipate", risk_level: "limited" },
  { code: "E357", name: "Potassium adipate", risk_level: "limited" },
  // Succinic acid
  { code: "E363", name: "Succinic acid", risk_level: "limited" },
  // Niacin
  { code: "E375", name: "Niacin (Vitamin B3)", risk_level: "limited" },
  // Triammonium citrate
  { code: "E380", name: "Triammonium citrate", risk_level: "limited" },
  // Alginates, agar, gums
  { code: "E400", name: "Alginic acid", risk_level: "limited" },
  { code: "E401", name: "Sodium alginate", risk_level: "limited" },
  { code: "E402", name: "Potassium alginate", risk_level: "limited" },
  { code: "E403", name: "Ammonium alginate", risk_level: "limited" },
  { code: "E404", name: "Calcium alginate", risk_level: "limited" },
  { code: "E405", name: "Propane-1,2-diol alginate", risk_level: "limited" },
  { code: "E406", name: "Agar", risk_level: "limited" },
  // Locust bean, guar, tragacanth, xanthan, gellan
  { code: "E410", name: "Locust bean gum", risk_level: "limited" },
  { code: "E412", name: "Guar gum", risk_level: "limited" },
  { code: "E413", name: "Tragacanth gum", risk_level: "limited" },
  { code: "E414", name: "Acacia gum (Gum arabic)", risk_level: "limited" },
  { code: "E415", name: "Xanthan gum", risk_level: "limited" },
  { code: "E416", name: "Karaya gum", risk_level: "limited" },
  { code: "E417", name: "Tara gum", risk_level: "limited" },
  { code: "E418", name: "Gellan gum", risk_level: "limited" },
  // Sorbitol, mannitol
  { code: "E420", name: "Sorbitol", risk_level: "limited" },
  { code: "E421", name: "Mannitol", risk_level: "limited" },
  // Glycerol
  { code: "E422", name: "Glycerol", risk_level: "limited" },
  // Pectin
  { code: "E440", name: "Pectin", risk_level: "limited" },
  // Celluloses
  { code: "E460", name: "Microcrystalline cellulose", risk_level: "limited" },
  { code: "E461", name: "Methyl cellulose", risk_level: "limited" },
  { code: "E462", name: "Ethyl cellulose", risk_level: "limited" },
  { code: "E463", name: "Hydroxypropyl cellulose", risk_level: "limited" },
  { code: "E464", name: "Hydroxypropyl methyl cellulose", risk_level: "limited" },
  { code: "E465", name: "Ethyl methyl cellulose", risk_level: "limited" },
  // Fatty acid salts/esters
  { code: "E470a", name: "Sodium/potassium/calcium salts of fatty acids", risk_level: "limited" },
  { code: "E470b", name: "Magnesium salts of fatty acids", risk_level: "limited" },
  { code: "E471", name: "Mono- and diglycerides of fatty acids", risk_level: "limited" },
  { code: "E472a", name: "Acetic acid esters of mono- and diglycerides", risk_level: "limited" },
  { code: "E472b", name: "Lactic acid esters of mono- and diglycerides", risk_level: "limited" },
  { code: "E472c", name: "Citric acid esters of mono- and diglycerides", risk_level: "limited" },
  { code: "E472d", name: "Tartaric acid esters of mono- and diglycerides", risk_level: "limited" },
  { code: "E472e", name: "DATEM (diacetyl tartaric acid esters)", risk_level: "limited" },
  { code: "E472f", name: "Mixed acetic and tartaric acid esters", risk_level: "limited" },
  { code: "E473", name: "Sucrose esters of fatty acids", risk_level: "limited" },
  { code: "E474", name: "Sucroglycerides", risk_level: "limited" },
  { code: "E475", name: "Polyglycerol esters of fatty acids", risk_level: "limited" },
  { code: "E476", name: "Polyglycerol polyricinoleate (PGPR)", risk_level: "limited" },
  { code: "E477", name: "Propane-1,2-diol esters of fatty acids", risk_level: "limited" },
  { code: "E479b", name: "Thermally oxidized soya bean oil", risk_level: "limited" },
  // Stearoyl lactylates
  { code: "E481", name: "Sodium stearoyl-2-lactylate", risk_level: "limited" },
  { code: "E482", name: "Calcium stearoyl-2-lactylate", risk_level: "limited" },
  // Carbonates
  { code: "E500", name: "Sodium carbonates (Baking soda)", risk_level: "limited" },
  { code: "E501", name: "Potassium carbonates", risk_level: "limited" },
  { code: "E503", name: "Ammonium carbonates", risk_level: "limited" },
  { code: "E504", name: "Magnesium carbonates", risk_level: "limited" },
  // Calcium chloride
  { code: "E509", name: "Calcium chloride", risk_level: "limited" },
  // Magnesium chloride
  { code: "E511", name: "Magnesium chloride", risk_level: "limited" },
  // Sulfates
  { code: "E514", name: "Sodium sulfates", risk_level: "limited" },
  { code: "E515", name: "Potassium sulfates", risk_level: "limited" },
  { code: "E516", name: "Calcium sulfate", risk_level: "limited" },
  // Sodium hydroxide
  { code: "E524", name: "Sodium hydroxide", risk_level: "limited" },
  // Silicon dioxide, silicates, talc
  { code: "E551", name: "Silicon dioxide", risk_level: "limited" },
  { code: "E552", name: "Calcium silicate", risk_level: "limited" },
  { code: "E553a", name: "Magnesium silicate", risk_level: "limited" },
  { code: "E553b", name: "Talc", risk_level: "limited" },
  // Stearic acid
  { code: "E570", name: "Stearic acid", risk_level: "limited" },
  // Glucono delta-lactone
  { code: "E575", name: "Glucono delta-lactone", risk_level: "limited" },
  // Waxes, shellac
  { code: "E901", name: "Beeswax", risk_level: "limited" },
  { code: "E902", name: "Candelilla wax", risk_level: "limited" },
  { code: "E903", name: "Carnauba wax", risk_level: "limited" },
  { code: "E904", name: "Shellac", risk_level: "limited" },
  // L-cysteine
  { code: "E920", name: "L-cysteine", risk_level: "limited" },
  // Gases
  { code: "E938", name: "Argon", risk_level: "limited" },
  { code: "E939", name: "Helium", risk_level: "limited" },
  { code: "E941", name: "Nitrogen", risk_level: "limited" },
  { code: "E942", name: "Nitrous oxide", risk_level: "limited" },
  { code: "E948", name: "Oxygen", risk_level: "limited" },
  // Sugar alcohols
  { code: "E953", name: "Isomalt", risk_level: "limited" },
  { code: "E965", name: "Maltitol", risk_level: "limited" },
  { code: "E966", name: "Lactitol", risk_level: "limited" },
  { code: "E967", name: "Xylitol", risk_level: "limited" },
  { code: "E968", name: "Erythritol", risk_level: "limited" },
  // Enzymes
  { code: "E1103", name: "Invertase", risk_level: "limited" },
  { code: "E1105", name: "Lysozyme", risk_level: "limited" },
  // Polydextrose
  { code: "E1200", name: "Polydextrose", risk_level: "limited" },
  // Modified starches
  { code: "E1404", name: "Oxidized starch", risk_level: "limited" },
  { code: "E1410", name: "Monostarch phosphate", risk_level: "limited" },
  { code: "E1412", name: "Distarch phosphate", risk_level: "limited" },
  { code: "E1413", name: "Phosphated distarch phosphate", risk_level: "limited" },
  { code: "E1414", name: "Acetylated distarch phosphate", risk_level: "limited" },
  { code: "E1420", name: "Acetylated starch", risk_level: "limited" },
  { code: "E1422", name: "Acetylated distarch adipate", risk_level: "limited" },
  { code: "E1440", name: "Hydroxypropyl starch", risk_level: "limited" },
  { code: "E1442", name: "Hydroxypropyl distarch phosphate", risk_level: "limited" },
  { code: "E1450", name: "Starch sodium octenyl succinate", risk_level: "limited" },
  { code: "E1451", name: "Acetylated oxidized starch", risk_level: "limited" },
  { code: "E1452", name: "Starch aluminium octenyl succinate", risk_level: "limited" },
  // Solvents
  { code: "E1505", name: "Triethyl citrate", risk_level: "limited" },
  { code: "E1510", name: "Ethanol", risk_level: "limited" },
  { code: "E1520", name: "Propylene glycol", risk_level: "limited" },
];

const db = getDb();
const ts = nowIso();

db.transaction(() => {
  for (const a of SEED) {
    db.query(`INSERT OR REPLACE INTO additive_risks (code, name, risk_level, updated_at) VALUES (?, ?, ?, ?)`).run(
      a.code,
      a.name,
      a.risk_level,
      ts
    );
  }
})();

console.log("[seed] additive_risks seeded:", SEED.length);
