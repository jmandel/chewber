import { Database } from "bun:sqlite";
import { resolve } from "node:path";
import { nowIso } from "../utils/id";

/**
 * Seed the additive risk table with ~250 common E-number food additives.
 *
 * Risk levels based on published evidence from authoritative sources:
 *   - EFSA scientific opinions and re-evaluations (efsa.europa.eu)
 *   - FDA GRAS determinations and 21 CFR regulations (fda.gov)
 *   - JECFA evaluations and ADIs (WHO)
 *   - IARC monograph classifications (monographs.iarc.who.int)
 *   - NTP Report on Carcinogens
 *
 * Tier definitions:
 *   risk_free — No credible evidence of harm at food-additive levels. EFSA/JECFA
 *              "ADI not specified" or very high ADI. Naturally occurring or identical
 *              to endogenous substances.
 *   limited  — GRAS/approved with established ADI. No serious safety signals but
 *              presence signals some degree of processing. Minor concerns only at
 *              high doses (e.g. laxative effects for sugar alcohols).
 *   moderate — Approved but with caveats: EFSA reduced ADI, ADI exceeded in some
 *              populations (especially children), credible animal studies showing
 *              adverse effects, or allergenicity concerns affecting >0.5% of population.
 *   high     — Banned in major jurisdictions, IARC Group 2A/2B with corroborating
 *              regulatory action, EFSA unable to confirm safety, bioaccumulation
 *              with TWI exceedance, or strong mechanistic evidence of harm.
 *
 * Last evidence review: 2026-02-26
 * Re-running is idempotent (INSERT OR REPLACE).
 */
const SEED: Array<{
  code: string;
  name: string;
  risk_level: "risk_free" | "limited" | "moderate" | "high";
  function_category?: string;
  description?: string;
  justification?: string;
}> = [
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
  // Acetic acid/acetates — vinegar and its salts
  { code: "E260", name: "Acetic acid", risk_level: "risk_free" },
  { code: "E261", name: "Potassium acetate", risk_level: "risk_free" },
  { code: "E262", name: "Sodium acetates", risk_level: "risk_free" },
  { code: "E263", name: "Calcium acetate", risk_level: "risk_free" },
  // Lactic acid — endogenous metabolite, naturally in fermented foods
  { code: "E270", name: "Lactic acid", risk_level: "risk_free" },
  // Carbon dioxide — inert gas
  { code: "E290", name: "Carbon dioxide", risk_level: "risk_free" },
  // Lecithin — natural phospholipid in egg yolks/soybeans
  { code: "E322", name: "Lecithin", risk_level: "risk_free" },
  // Lactates — salt forms of lactic acid (E270)
  { code: "E325", name: "Sodium lactate", risk_level: "risk_free" },
  { code: "E326", name: "Potassium lactate", risk_level: "risk_free" },
  { code: "E327", name: "Calcium lactate", risk_level: "risk_free" },
  // Citrates — salt forms of citric acid (E330)
  { code: "E331", name: "Sodium citrates", risk_level: "risk_free" },
  { code: "E332", name: "Potassium citrates", risk_level: "risk_free" },
  { code: "E333", name: "Calcium citrates", risk_level: "risk_free" },
  // Tartrates — natural in grapes
  { code: "E334", name: "Tartaric acid", risk_level: "risk_free" },
  { code: "E335", name: "Sodium tartrates", risk_level: "risk_free" },
  { code: "E336", name: "Potassium tartrates (Cream of tartar)", risk_level: "risk_free" },
  { code: "E337", name: "Sodium potassium tartrate", risk_level: "risk_free" },
  // Niacin — essential B vitamin
  { code: "E375", name: "Niacin (Vitamin B3)", risk_level: "risk_free" },
  // Rosemary extract — natural antioxidant
  { code: "E392", name: "Rosemary extract", risk_level: "risk_free" },
  // Alginates, agar, and common gums — EFSA: "no need for numerical ADI",
  // "no safety concern". FDA GRAS. Natural polysaccharides.
  { code: "E400", name: "Alginic acid", risk_level: "risk_free" },
  { code: "E401", name: "Sodium alginate", risk_level: "risk_free" },
  { code: "E402", name: "Potassium alginate", risk_level: "risk_free" },
  { code: "E403", name: "Ammonium alginate", risk_level: "risk_free" },
  { code: "E404", name: "Calcium alginate", risk_level: "risk_free" },
  { code: "E406", name: "Agar", risk_level: "risk_free" },
  { code: "E410", name: "Locust bean gum", risk_level: "risk_free" },
  { code: "E412", name: "Guar gum", risk_level: "risk_free" },
  { code: "E414", name: "Acacia gum (Gum arabic)", risk_level: "risk_free" },
  { code: "E415", name: "Xanthan gum", risk_level: "risk_free" },
  { code: "E417", name: "Tara gum", risk_level: "risk_free" },
  { code: "E418", name: "Gellan gum", risk_level: "risk_free" },
  // Pectin — natural fruit fiber
  { code: "E440", name: "Pectin", risk_level: "risk_free" },
  // Carbonates — baking soda and related
  { code: "E500", name: "Sodium carbonates (Baking soda)", risk_level: "limited", function_category: "Raising agent", description: "Baking soda — common leavening agent that releases CO₂ when heated or acidified." },
  { code: "E501", name: "Potassium carbonates", risk_level: "risk_free" },
  { code: "E503", name: "Ammonium carbonates", risk_level: "risk_free" },
  { code: "E504", name: "Magnesium carbonates", risk_level: "risk_free" },
  // Calcium chloride — cheese/tofu making
  { code: "E509", name: "Calcium chloride", risk_level: "risk_free" },
  // Stevia — plant-derived sweetener
  { code: "E960", name: "Steviol glycosides", risk_level: "risk_free" },
  // Inert gases — atmospheric gases, zero toxicological concern
  { code: "E938", name: "Argon", risk_level: "risk_free" },
  { code: "E939", name: "Helium", risk_level: "risk_free" },
  { code: "E941", name: "Nitrogen", risk_level: "risk_free" },
  { code: "E948", name: "Oxygen", risk_level: "risk_free" },

  // ──────────────────────────────────────────────
  // HIGH — banned in major jurisdictions, IARC 2A/2B with regulatory action,
  //        EFSA unable to confirm safety, or bioaccumulation with TWI exceedance
  // ──────────────────────────────────────────────

  // Azo dyes — McCann et al. 2007 ("Southampton study") linked to hyperactivity
  // in children; EU requires warning label "may have adverse effect on activity
  // and attention in children"; several banned in various countries.
  // EFSA re-evaluated 2009-2014, reduced ADIs for most.
  { code: "E102", name: "Tartrazine", risk_level: "high" },       // ADI 7.5 mg/kg/day (EFSA 2009); EU warning label
  { code: "E110", name: "Sunset Yellow FCF", risk_level: "high" }, // ADI 4 mg/kg/day (EFSA 2014 reduced from 2.5→4); EU warning
  { code: "E122", name: "Azorubine (Carmoisine)", risk_level: "high" }, // ADI 4 mg/kg/day; banned in US, Japan, Norway
  { code: "E123", name: "Amaranth", risk_level: "high" },         // Banned in US since 1976; ADI 0.5 mg/kg/day (EFSA)
  { code: "E124", name: "Ponceau 4R", risk_level: "high" },       // Banned in US; ADI 4 mg/kg/day (EFSA); EU warning
  { code: "E129", name: "Allura Red AC", risk_level: "high" },     // ADI 7 mg/kg/day; EU warning; California AB-660

  // Other synthetic dyes — banned in multiple jurisdictions
  { code: "E151", name: "Brilliant Black BN", risk_level: "high" },  // Banned in US, Canada, Japan, Australia
  { code: "E154", name: "Brown FK", risk_level: "high" },            // Banned in EU since 2004; very limited safety data
  { code: "E155", name: "Brown HT", risk_level: "high" },            // Banned in US and several EU countries

  // Titanium dioxide — EFSA 2021: "can no longer be considered safe",
  // genotoxicity concerns; EU banned in food from 2022 (Reg 2022/63).
  // FDA still permits but under increasing scrutiny.
  { code: "E171", name: "Titanium dioxide", risk_level: "high" },

  // Aluminium — EFSA 2008: TWI 1 mg/kg/week, but found TWI exceeded in
  // significant portion of population (children: 0.7-2.3 mg/kg/week).
  // Bioaccumulates; neurotoxic; not approved as direct food additive in US.
  // EU restricted uses via Reg 2018/1472.
  { code: "E173", name: "Aluminium", risk_level: "high" },

  // Nitrites/Nitrates — IARC Group 2A: "ingested nitrate or nitrite under
  // conditions that result in endogenous nitrosation" (Vol 94, 2006).
  // ANSES France 2022 recommended reducing exposure.
  // EFSA 2017 re-evaluated, confirmed ADI 0.06 mg/kg/day for nitrite.
  { code: "E249", name: "Potassium nitrite", risk_level: "high" },
  { code: "E250", name: "Sodium nitrite", risk_level: "high" },
  { code: "E251", name: "Sodium nitrate", risk_level: "high" },
  { code: "E252", name: "Potassium nitrate", risk_level: "high" },

  // BHA — IARC Group 2B (Vol 40, 1987); NTP "reasonably anticipated to be
  // a human carcinogen"; California Prop 65 listed. EFSA 2011: ADI 1.0 mg/kg/day.
  // Endocrine disruption concerns; tumor formation in rodent forestomach.
  { code: "E320", name: "Butylated hydroxyanisole (BHA)", risk_level: "high" },

  // Cyclamic acid — Banned in US since 1969 (FDA explicitly prohibits).
  // Also banned in Canada, South Korea. EFSA re-evaluation still ongoing.
  // IARC Group 3. EU ADI 7 mg/kg/day.
  { code: "E952", name: "Cyclamic acid", risk_level: "high" },

  // Propyl parabens — Banned in EU food since 2006. EFSA 2004 could NOT
  // establish an ADI due to reproductive toxicity (reduced sperm production
  // at lowest dose tested). JECFA also excluded from group ADI.
  { code: "E216", name: "Propyl p-hydroxybenzoate", risk_level: "high" },
  { code: "E217", name: "Sodium propyl p-hydroxybenzoate", risk_level: "high" },

  // ──────────────────────────────────────────────
  // MODERATE — approved but with caveats: reduced ADI, ADI exceeded in
  //           some populations, credible animal evidence, or allergenicity
  // ──────────────────────────────────────────────

  // Benzoic acid & benzoates — EFSA 2016: low toxicity, no genotoxicity,
  // no carcinogenicity. ADI 5 mg/kg/day. BUT: ADI exceeded in toddlers/children
  // consuming flavoured drinks (EFSA 2016). Benzene formation with ascorbic acid
  // is real but FDA found <5 ppb in most products after reformulation.
  // FDA considers sodium benzoate GRAS. Moderate reflects child ADI exceedance.
  { code: "E210", name: "Benzoic acid", risk_level: "moderate" },
  { code: "E211", name: "Sodium benzoate", risk_level: "moderate" },
  { code: "E212", name: "Potassium benzoate", risk_level: "moderate" },
  { code: "E213", name: "Calcium benzoate", risk_level: "moderate" },

  // Methyl/ethyl parabens — EFSA 2004: group ADI 0-10 mg/kg/day for
  // methyl and ethyl forms. Endocrine activity (Darbre 2004) primarily
  // cosmetic concern; food exposure well below ADI. Moderate is precautionary.
  // (Note: propyl parabens E216/E217 are HIGH — banned in EU food.)
  { code: "E214", name: "Ethyl p-hydroxybenzoate", risk_level: "moderate" },
  { code: "E215", name: "Sodium ethyl p-hydroxybenzoate", risk_level: "moderate" },
  { code: "E218", name: "Methyl p-hydroxybenzoate", risk_level: "moderate" },
  { code: "E219", name: "Sodium methyl p-hydroxybenzoate", risk_level: "moderate" },

  // Sulfites — allergenic; triggers asthma in ~1% of population.
  // Required allergen declaration in US/EU. JECFA ADI 0.7 mg/kg/day as SO2.
  // EFSA 2022 re-evaluation lowered group ADI. Moderate is appropriate for
  // a population-level app given the allergenicity prevalence.
  { code: "E220", name: "Sulfur dioxide", risk_level: "moderate" },
  { code: "E221", name: "Sodium sulfite", risk_level: "moderate" },
  { code: "E222", name: "Sodium hydrogen sulfite", risk_level: "moderate" },
  { code: "E223", name: "Sodium metabisulfite", risk_level: "moderate" },
  { code: "E224", name: "Potassium metabisulfite", risk_level: "moderate" },
  { code: "E225", name: "Potassium sulfite", risk_level: "moderate" },
  { code: "E226", name: "Calcium sulfite", risk_level: "moderate" },
  { code: "E227", name: "Calcium hydrogen sulfite", risk_level: "moderate" },
  { code: "E228", name: "Potassium hydrogen sulfite", risk_level: "moderate" },

  // Fungicides — surface treatment chemicals with residue concerns.
  // E233 (thiabendazole) is teratogenic in animals at high doses.
  { code: "E231", name: "Orthophenyl phenol", risk_level: "moderate" },
  { code: "E232", name: "Sodium orthophenyl phenol", risk_level: "moderate" },
  { code: "E233", name: "Thiabendazole", risk_level: "moderate" },

  // BHT — EFSA 2012: ADI 0.25 mg/kg/day (lower than BHA). Liver enzyme
  // induction in animals; endocrine concerns. Banned in baby food in EU.
  // Less evidence than BHA (no IARC classification) but mechanistic concerns
  // and very low ADI warrant moderate. eadditives.com rates ORANGE.
  { code: "E321", name: "Butylated hydroxytoluene (BHT)", risk_level: "moderate" },

  // Gallates — EFSA 2014: group ADI 0.5 mg/kg/day. E311/E312 no longer
  // authorized in EU. E310 still permitted. IARC Group 3 for propyl gallate.
  // Limited evidence of endocrine disruption. Moderate given low ADI and
  // partial EU withdrawal.
  { code: "E310", name: "Propyl gallate", risk_level: "moderate" },
  { code: "E311", name: "Octyl gallate", risk_level: "moderate" },
  { code: "E312", name: "Dodecyl gallate", risk_level: "moderate" },

  // TBHQ — EFSA 2004 reduced ADI to 0.7 mg/kg/day (from previous 0.7,
  // confirmed). Stomach tumors in high-dose rat studies. Same class as
  // BHA/BHT but less studied. Moderate given confirmed low ADI.
  { code: "E319", name: "Tertiary butylhydroquinone (TBHQ)", risk_level: "moderate" },

  // Propionates — EFSA 2014 re-evaluation: ADI 17 mg/kg/day (expressed as
  // propionic acid). Generally low concern at food-additive levels.
  // Some animal behavioral studies but weak evidence. Moderate is conservative.
  { code: "E280", name: "Propionic acid", risk_level: "moderate" },
  { code: "E281", name: "Sodium propionate", risk_level: "moderate" },
  { code: "E282", name: "Calcium propionate", risk_level: "moderate" },
  { code: "E283", name: "Potassium propionate", risk_level: "moderate" },

  // Phosphates — EFSA 2019: group ADI 40 mg/kg/day (as phosphorus).
  // Excessive dietary phosphorus linked to cardiovascular risk and bone loss
  // (Kidney Int 2013). Ubiquitous in processed food; cumulative exposure
  // concern rather than individual additive toxicity.
  { code: "E338", name: "Phosphoric acid", risk_level: "high", function_category: "Acidity regulator", description: "Mineral acid used in cola and processed foods to add tartness and regulate pH." },
  { code: "E339", name: "Sodium phosphates", risk_level: "high", function_category: "Texturizing agent", description: "Sodium salts of phosphoric acid used as emulsifiers and moisture binders in processed meats and cheese." },
  { code: "E340", name: "Potassium phosphates", risk_level: "high", function_category: "Texturizing agent", description: "Potassium salts of phosphoric acid used as buffering agents and stabilizers." },
  { code: "E341", name: "Calcium phosphates", risk_level: "high", function_category: "Texturizing agent", description: "Calcium salts of phosphoric acid used as leavening agents and dough conditioners in baked goods." },
  { code: "E343", name: "Magnesium phosphates", risk_level: "high", function_category: "Texturizing agent", description: "Magnesium salts of phosphoric acid used as acidity regulators and anti-caking agents." },
  { code: "E450", name: "Diphosphates (Pyrophosphates)", risk_level: "high", function_category: "Texturizing agent", description: "Pyrophosphate salts used as leavening and emulsifying agents in baked goods, meats, and cheese." },
  { code: "E451", name: "Triphosphates", risk_level: "high", function_category: "Texturizing agent", description: "Phosphate salts used for moisture retention in processed meats and seafood." },
  { code: "E452", name: "Polyphosphates", risk_level: "high", function_category: "Texturizing agent", description: "Long-chain phosphate polymers used to bind water and improve texture in processed meats." },

  // Carrageenan — JECFA/EFSA consider food-grade carrageenan safe.
  // Tobacman 2001/2006 animal studies show gut inflammation; degraded
  // carrageenan (poligeenan) is a known carcinogen but banned in food.
  // Chassaing 2015 (Nature): emulsifiers disrupt gut microbiome in mice.
  // eadditives.com rates ORANGE. Moderate reflects ongoing controversy.
  { code: "E407", name: "Carrageenan", risk_level: "moderate" },

  // Polysorbates — Chassaing et al. 2015 (Nature): polysorbate 80 and
  // CMC altered gut microbiota and promoted inflammation in mice.
  // Wellens et al. (human RCT) confirmed some microbiome effects.
  // EFSA: ADI 25 mg/kg/day. Moderate given emerging human evidence.
  { code: "E433", name: "Polysorbate 80", risk_level: "moderate" },
  { code: "E435", name: "Polysorbate 60", risk_level: "moderate" },
  { code: "E436", name: "Polysorbate 65", risk_level: "moderate" },

  // CMC — Same Chassaing 2015 study as polysorbates.
  { code: "E466", name: "Carboxymethyl cellulose", risk_level: "moderate" },

  // Caramel colors III/IV — EFSA 2011: individual ADI 100 mg/kg/day for
  // E150c (THI immunotoxicity). E150c/d contain 4-MEI (4-methylimidazole),
  // NTP 2007 found carcinogenic in mice. California Prop 65 listed.
  { code: "E150c", name: "Ammonia caramel", risk_level: "moderate" },
  { code: "E150d", name: "Sulphite ammonia caramel", risk_level: "moderate" },

  // Aspartame — IARC Group 2B (July 2023, Vol 134) "possibly carcinogenic".
  // BUT: JECFA simultaneously reaffirmed ADI 40 mg/kg/day; EFSA 2013 confirmed
  // safety; FDA ADI 50 mg/kg/day and explicitly disagreed with IARC.
  // Group 2B = same category as aloe vera and pickled vegetables.
  // Moderate reflects the IARC classification creating genuine uncertainty,
  // despite regulatory consensus on safety.
  { code: "E951", name: "Aspartame", risk_level: "moderate" },

  // Saccharin — EFSA: ADI 5 mg/kg/day. Early rat bladder cancer concern
  // (mechanism not relevant to humans per NTP). IARC downgraded from 2B to 3.
  // FDA de-listed from carcinogen warning in 2000. Moderate is conservative.
  { code: "E954", name: "Saccharin", risk_level: "moderate" },

  // Talc — EFSA 2018: "safety cannot be assessed" due to lacking data.
  // IARC July 2024: Group 2A "probably carcinogenic" (primarily inhalation/
  // perineal, but oral route not excluded). ECHA proposed carcinogen class.
  // Moderate is minimum; high would also be defensible.
  { code: "E553b", name: "Talc", risk_level: "moderate" },

  // ──────────────────────────────────────────────────────────────────────
  // LIMITED — GRAS/approved with established ADI; no serious safety signals;
  //          presence signals processing; minor concerns only at high doses
  // ──────────────────────────────────────────────────────────────────────

  // Sorbic acid/sorbates — EFSA: ADI 25 mg/kg/day. GRAS.
  { code: "E200", name: "Sorbic acid", risk_level: "limited" },
  { code: "E201", name: "Sodium sorbate", risk_level: "limited" },
  { code: "E202", name: "Potassium sorbate", risk_level: "limited" },
  { code: "E203", name: "Calcium sorbate", risk_level: "limited" },
  // Nisin — natural antimicrobial peptide. EFSA: ADI 1 mg/kg/day. GRAS.
  { code: "E234", name: "Nisin", risk_level: "limited" },
  // Caramel color Class II — no 4-MEI/THI concern (unlike E150c/d).
  { code: "E150b", name: "Caustic sulphite caramel", risk_level: "limited" },
  // Malic acid / fumaric acid — naturally occurring organic acids.
  { code: "E296", name: "Malic acid", risk_level: "limited" },
  { code: "E297", name: "Fumaric acid", risk_level: "limited" },
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
  // Triammonium citrate
  { code: "E380", name: "Triammonium citrate", risk_level: "limited" },
  // EDTA — FDA approved (21 CFR 172.120). JECFA ADI 2.5 mg/kg/day.
  // Not in IARC. Low ADI warrants limited but no carcinogenicity flags.
  { code: "E385", name: "Calcium disodium EDTA", risk_level: "limited" },
  // Esterified alginate — modified, different from natural alginates
  { code: "E405", name: "Propane-1,2-diol alginate", risk_level: "limited" },
  // Less-studied gums — keep limited due to allergenic potential
  { code: "E413", name: "Tragacanth gum", risk_level: "limited" },
  { code: "E416", name: "Karaya gum", risk_level: "limited" },
  // Sorbitol, mannitol — laxative effects at >20-50g/day.
  { code: "E420", name: "Sorbitol", risk_level: "limited" },
  { code: "E421", name: "Mannitol", risk_level: "limited" },
  // Glycerol — endogenous metabolite. GRAS.
  { code: "E422", name: "Glycerol", risk_level: "limited" },
  // Celluloses — GRAS, insoluble fiber derivatives.
  { code: "E460", name: "Microcrystalline cellulose", risk_level: "limited" },
  { code: "E461", name: "Methyl cellulose", risk_level: "limited" },
  { code: "E462", name: "Ethyl cellulose", risk_level: "limited" },
  { code: "E463", name: "Hydroxypropyl cellulose", risk_level: "limited" },
  { code: "E464", name: "Hydroxypropyl methyl cellulose", risk_level: "limited" },
  { code: "E465", name: "Ethyl methyl cellulose", risk_level: "limited" },
  // Fatty acid salts/esters — GRAS emulsifiers.
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
  // Stearoyl lactylates — GRAS bread emulsifiers.
  { code: "E481", name: "Sodium stearoyl-2-lactylate", risk_level: "limited" },
  { code: "E482", name: "Calcium stearoyl-2-lactylate", risk_level: "limited" },
  // HCl — pH regulator. GRAS. Harmless at food-additive levels.
  { code: "E507", name: "Hydrochloric acid", risk_level: "limited" },
  // KCl — salt substitute. FDA GRAS. GI side effects only at high doses.
  { code: "E508", name: "Potassium chloride", risk_level: "limited" },
  // Mineral salts — GRAS.
  { code: "E511", name: "Magnesium chloride", risk_level: "limited" },
  { code: "E514", name: "Sodium sulfates", risk_level: "limited" },
  { code: "E515", name: "Potassium sulfates", risk_level: "limited" },
  { code: "E516", name: "Calcium sulfate", risk_level: "limited" },
  { code: "E524", name: "Sodium hydroxide", risk_level: "limited" },
  // Silicon dioxide, silicates — anti-caking agents. GRAS.
  { code: "E551", name: "Silicon dioxide", risk_level: "limited" },
  { code: "E552", name: "Calcium silicate", risk_level: "limited" },
  { code: "E553a", name: "Magnesium silicate", risk_level: "limited" },
  // Stearic acid
  { code: "E570", name: "Stearic acid", risk_level: "limited" },
  // Glucono delta-lactone
  { code: "E575", name: "Glucono delta-lactone", risk_level: "limited" },
  // MSG and glutamates — FDA GRAS. EFSA 2017: group ADI 30 mg/kg/day.
  // Not in IARC. Limited because EFSA found ADI may be exceeded in
  // heavy consumers and children.
  { code: "E620", name: "Glutamic acid", risk_level: "limited" },
  { code: "E621", name: "Monosodium glutamate (MSG)", risk_level: "limited" },
  { code: "E622", name: "Monopotassium glutamate", risk_level: "limited" },
  { code: "E623", name: "Calcium diglutamate", risk_level: "limited" },
  { code: "E624", name: "Monoammonium glutamate", risk_level: "limited" },
  { code: "E625", name: "Magnesium diglutamate", risk_level: "limited" },
  // Nucleotide flavor enhancers — purine-based; gout concern for susceptible.
  { code: "E627", name: "Disodium guanylate", risk_level: "limited" },
  { code: "E631", name: "Disodium inosinate", risk_level: "limited" },
  { code: "E635", name: "Disodium 5'-ribonucleotides", risk_level: "limited" },
  // Dimethylpolysiloxane — anti-foaming. FDA GRAS. Low bioavailability.
  { code: "E900", name: "Dimethylpolysiloxane", risk_level: "limited" },
  // Waxes, shellac — glazing agents. GRAS.
  { code: "E901", name: "Beeswax", risk_level: "limited" },
  { code: "E902", name: "Candelilla wax", risk_level: "limited" },
  { code: "E903", name: "Carnauba wax", risk_level: "limited" },
  { code: "E904", name: "Shellac", risk_level: "limited" },
  // L-cysteine — amino acid dough conditioner. GRAS.
  { code: "E920", name: "L-cysteine", risk_level: "limited" },
  // Nitrous oxide — safe as propellant but pharmacological effects.
  { code: "E942", name: "Nitrous oxide", risk_level: "limited" },
  // Acesulfame K — EFSA April 2025: RAISED ADI from 9→15 mg/kg/day.
  // "No safety concern." Not in IARC.
  { code: "E950", name: "Acesulfame K", risk_level: "limited" },
  // Sugar alcohols — laxative effects at high doses; otherwise safe.
  { code: "E953", name: "Isomalt", risk_level: "limited" },
  { code: "E965", name: "Maltitol", risk_level: "limited" },
  { code: "E966", name: "Lactitol", risk_level: "limited" },
  { code: "E967", name: "Xylitol", risk_level: "limited" },
  // Erythritol — EFSA Dec 2023: no causal link to cardiovascular events
  // (Witkowski 2023 study addressed). ADI 0.5 g/kg/day.
  { code: "E968", name: "Erythritol", risk_level: "limited" },
  // Sucralose — EFSA Feb 2026: confirmed ADI 15 mg/kg/day. No genotoxicity.
  { code: "E955", name: "Sucralose", risk_level: "limited" },
  // Quillaia extract — EFSA 2019: no genotoxicity, no carcinogenicity.
  // ADI 3 mg saponins/kg/day. Exposure below ADI.
  { code: "E999", name: "Quillaia extract", risk_level: "limited" },
  // Enzymes — processing aids. GRAS.
  { code: "E1103", name: "Invertase", risk_level: "limited" },
  { code: "E1105", name: "Lysozyme", risk_level: "limited" },
  // Polydextrose — soluble fiber. GRAS.
  { code: "E1200", name: "Polydextrose", risk_level: "limited" },
  // Modified starches — GRAS; ultra-processing marker.
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
  // Solvents — GRAS.
  { code: "E1505", name: "Triethyl citrate", risk_level: "limited" },
  { code: "E1510", name: "Ethanol", risk_level: "limited" },
  { code: "E1520", name: "Propylene glycol", risk_level: "limited" },
];

const dbPath = process.env.CHEWBER_REF_DB_PATH ??
  resolve(import.meta.dir, "../../../../data/usda.sqlite");
const db = new Database(dbPath);
const ts = nowIso();

db.transaction(() => {
  for (const a of SEED) {
    db.query(
      `INSERT OR REPLACE INTO additive_risks (code, name, risk_level, function_category, description, justification, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      a.code,
      a.name,
      a.risk_level,
      a.function_category ?? null,
      a.description ?? null,
      a.justification ?? null,
      ts
    );
  }
})();

console.log("[seed] additive_risks seeded:", SEED.length);
