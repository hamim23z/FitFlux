import "dotenv/config";
import fs from "fs";
import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient.js";

async function main() {
  const file = fs.readFileSync("data/All_Diets.csv", "utf8");

  const results = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });
  const data = results.data.map((row) => ({
    diet_type: row.diet_type,
    recipe_name: row.recipe_name,
    cuisine_type: row.cuisine_type,
    protein: parseFloat(row.protein),
    carbs: parseFloat(row.carbs),
    fat: parseFloat(row.fat),
  }));

  console.log(`Found ${data.length} rows`);

  const chunkSize = 1000;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const { error } = await supabase.from("testing_table").insert(chunk);

    if (error) {
      console.error("Insert error at rows", i, "to", i + chunk.length, error);
    } else {
      console.log(`Inserted rows ${i} to ${i + chunk.length}`);
    }
  }

  console.log("Import completed!");
}
main();
