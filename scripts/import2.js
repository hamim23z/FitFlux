//this is for importing the megaGymDataset.csv file
//was tricky because there were duplicate issues for name and desc columns.
import "dotenv/config";
import fs from "fs";
import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient.js";

async function main() {
  const file = fs.readFileSync("data/megaGymDataset.csv", "utf8");
  const results = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });

  const data = results.data.map((row) => ({
    name: row.name,
    desc: row.desc,
    type: row.type,
    muscle_group: row.muscle_group,
    equipment: row.equipment,
    level: row.level,
  }));

  console.log(`Found ${data.length} rows in CSV`);

  const uniqueData = Array.from(
    new Map(data.map((item) => [item.name, item])).values()
  );

  const chunkSize = 1000;
  for (let i = 0; i < uniqueData.length; i += chunkSize) {
    const chunk = uniqueData.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("exercise_catalog")
      .insert(chunk, { onConflict: ["name"] });
    if (error) {
      console.error("Insert error at rows", i, "to", i + chunk.length, error);
    } else {
      console.log(`Inserted rows ${i} to ${i + chunk.length}`);
    }
  }

  console.log("Import completed!");
}
main();