//this is THE IMPORT SCRIPT FOR THE RECIPE_CATALOG TABLE. COMPLETED. 961 ROWS IMPORTED.
import "dotenv/config";
import fs from "fs";
import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient.js";

async function main() {
  const file = fs.readFileSync("data/recipe_catalog.csv", "utf8");
  const results = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });
  const data = results.data.map((row) => ({
    recipe_name: row.recipe_name,
    prep_time: row.prep_time,
    cook_time: row.cook_time,
    servings: row.servings,
    yield: row.yield,
    ingredients: row.ingredients,
    instructions: row.instructions,
    url: row.url,
    cuisine_path: row.cuisine_path,
    nutrition: row.nutrition,
    img_src: row.img_src
  }));

  console.log(`Found ${data.length} rows`);

  const chunkSize = 1000;
  for (let i = 0; i < data.length; i += chunkSize) {
    let chunk = data.slice(i, i + chunkSize);

    //remove duplicates within the chunk
    const seen = new Set();
    chunk = chunk.filter((row) => {
      if (seen.has(row.recipe_name)) return false;
      seen.add(row.recipe_name);
      return true;
    });

    const { error } = await supabase
      .from("food_catalog")
      .upsert(chunk, { onConflict: "recipe_name" });

    if (error) {
      console.error("Insert error at rows", i, "to", i + chunk.length, error);
    } else {
      console.log(
        `Inserted rows ${i} to ${i + chunk.length} (duplicates ignored)`
      );
    }
  }

  console.log("Import completed!");
}
main();