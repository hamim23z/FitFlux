//this is THE IMPORT SCRIPT FOR THE EXERCISE_CATALOG TABLE. COMPLETED. 340 ENTRIES. 
import "dotenv/config";
import fs from "fs";
import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient.js";

async function main() {
  const file = fs.readFileSync("data/gym_exercise_dataset.csv", "utf8");
  const results = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });
  const data = results.data.map((row) => ({
    exercise_name: row.exercise_name,
    desc: row.desc,
    force: row.force,
    muscle_group: row.muscle_group,
    equipment: row.equipment,
    level: row.level,
    execution: row.execution,
    mechanics: row.mechanics,
  }));

  console.log(`Found ${data.length} rows`);

  const chunkSize = 1000;
  for (let i = 0; i < data.length; i += chunkSize) {
    let chunk = data.slice(i, i + chunkSize);

    //remove duplicates within the chunk
    const seen = new Set();
    chunk = chunk.filter((row) => {
      if (seen.has(row.exercise_name)) return false;
      seen.add(row.exercise_name);
      return true;
    });

    const { error } = await supabase
      .from("exercise_catalog")
      .upsert(chunk, { onConflict: "exercise_name" });

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
