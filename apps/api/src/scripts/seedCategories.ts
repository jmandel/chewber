/**
 * Seed the categories registry with starter categories.
 * Idempotent — upserts display_name and description so re-running
 * picks up any changes to the curated list.
 */
import { getDb } from "../db";

const STARTER_CATEGORIES: [slug: string, displayName: string, description: string][] = [
  // Grains & cereals
  ["breakfast-cereal", "Breakfast Cereal", "Ready-to-eat or hot breakfast cereals and granola"],
  ["whole-grain", "Whole Grain", "Foods made primarily from whole grains"],
  ["bread", "Bread", "Loaves, rolls, flatbreads, tortillas, and wraps"],
  ["pasta", "Pasta", "Dried or fresh pasta, noodles, and couscous"],
  ["rice", "Rice", "White, brown, wild rice, and rice-based dishes"],
  ["baked-goods", "Baked Goods", "Cookies, cakes, pastries, muffins, and other baked treats"],

  // Fruits
  ["fruit", "Fruit", "Fresh, dried, or frozen fruit (general)"],
  ["citrus-fruit", "Citrus Fruit", "Oranges, lemons, limes, grapefruit, and other citrus"],
  ["tropical-fruit", "Tropical Fruit", "Bananas, mangoes, pineapple, papaya, and other tropical fruits"],
  ["stone-fruit", "Stone Fruit", "Peaches, plums, cherries, nectarines, and apricots"],
  ["berry", "Berry", "Strawberries, blueberries, raspberries, and other berries"],

  // Vegetables
  ["vegetable", "Vegetable", "Fresh, frozen, or canned vegetables (general)"],
  ["leafy-green", "Leafy Green", "Lettuce, spinach, kale, arugula, and other greens"],
  ["root-vegetable", "Root Vegetable", "Carrots, potatoes, beets, turnips, and other roots"],
  ["cruciferous", "Cruciferous", "Broccoli, cauliflower, cabbage, Brussels sprouts"],
  ["allium", "Allium", "Onions, garlic, leeks, shallots, and chives"],

  // Protein
  ["meat", "Meat", "Beef, pork, lamb, and other red meats"],
  ["poultry", "Poultry", "Chicken, turkey, duck, and other poultry"],
  ["seafood", "Seafood", "Fish, shellfish, and other seafood"],
  ["deli-meat", "Deli Meat", "Sliced meats, cold cuts, charcuterie, and cured meats"],
  ["egg", "Egg", "Eggs and egg-based products"],
  ["legume", "Legume", "Beans, lentils, chickpeas, and peas"],
  ["tofu-tempeh", "Tofu & Tempeh", "Soy-based protein foods"],

  // Dairy & alternatives
  ["dairy", "Dairy", "Milk, cream, and general dairy products"],
  ["cheese", "Cheese", "Hard, soft, processed, and specialty cheeses"],
  ["yogurt", "Yogurt", "Regular, Greek, skyr, and plant-based yogurts"],

  // Fats & oils
  ["cooking-oil", "Cooking Oil", "Olive, canola, coconut, and other cooking oils"],
  ["butter-spread", "Butter & Spread", "Butter, margarine, and spreadable fats"],
  ["nut-butter", "Nut Butter", "Peanut butter, almond butter, and other nut/seed spreads"],

  // Snacks
  ["snack", "Snack", "Chips, crackers, pretzels, and savory snacks"],
  ["snack-bar", "Snack Bar", "Granola bars, protein bars, energy bars"],
  ["nuts-seeds", "Nuts & Seeds", "Whole or roasted nuts and seeds"],
  ["candy", "Candy", "Candy, chocolate, and sugar confections"],

  // Beverages
  ["beverage", "Beverage", "General drinks and beverages"],
  ["juice", "Juice", "Fruit and vegetable juices"],
  ["soda", "Soda", "Carbonated soft drinks"],
  ["energy-drink", "Energy Drink", "Caffeinated energy and sport drinks"],
  ["tea-coffee", "Tea & Coffee", "Tea, coffee, and related beverages"],
  ["plant-milk", "Plant Milk", "Oat, almond, soy, and other non-dairy milks"],

  // Prepared & convenience
  ["frozen-meal", "Frozen Meal", "Ready-to-heat frozen entrees and meals"],
  ["canned-food", "Canned Food", "Canned soups, vegetables, beans, and meats"],
  ["condiment", "Condiment", "Ketchup, mustard, hot sauce, mayo, and dressings"],
  ["sauce", "Sauce", "Pasta sauce, cooking sauces, marinades, and gravies"],
  ["soup", "Soup", "Ready-to-eat or condensed soups and broths"],
  ["seasoning", "Seasoning", "Spices, herbs, salt, pepper, and seasoning blends"],
  ["baby-food", "Baby Food", "Infant and toddler foods and formulas"],

  // Dietary identity
  ["plant-based", "Plant-Based", "Vegan or primarily plant-derived foods"],
  ["gluten-free", "Gluten-Free", "Certified or inherently gluten-free foods"],
  ["fermented", "Fermented", "Fermented foods like kimchi, sauerkraut, kombucha, miso"],
  ["sweetener", "Sweetener", "Sugar, honey, maple syrup, stevia, and artificial sweeteners"],
];

const db = getDb();

const upsert = db.prepare(
  `INSERT INTO categories (slug, display_name, description, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?)
   ON CONFLICT(slug) DO UPDATE SET
     display_name = excluded.display_name,
     description  = excluded.description,
     updated_at   = excluded.updated_at`
);

const now = new Date().toISOString();

db.exec("BEGIN");
for (const [slug, displayName, description] of STARTER_CATEGORIES) {
  upsert.run(slug, displayName, description, now, now);
}
db.exec("COMMIT");

console.log(`[seedCategories] upserted ${STARTER_CATEGORIES.length} categories`);
