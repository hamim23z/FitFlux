import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    let {
      weightLbs,
      age,
      heightCm,
      gender,
      prepTimeMinutes,
      ingredients = [],
    } = body || {};

    const errors = [];

    weightLbs = weightLbs !== undefined ? Number(weightLbs) : undefined;
    age = age !== undefined ? Number(age) : undefined;
    heightCm = heightCm !== undefined ? Number(heightCm) : undefined;
    prepTimeMinutes =
      prepTimeMinutes !== undefined ? Number(prepTimeMinutes) : undefined;

    if (weightLbs == null || Number.isNaN(weightLbs)) {
      errors.push("Weight (lbs) is required and must be a number.");
    } else if (weightLbs <= 0 || weightLbs > 500) {
      errors.push("Weight must be between 1 and 500 lbs.");
    }

    if (age == null || Number.isNaN(age)) {
      errors.push("Age is required and must be a number.");
    } else if (age <= 0 || age >= 100) {
      errors.push("Age must be between 1 and 99.");
    }

    if (heightCm == null || Number.isNaN(heightCm)) {
      errors.push("Height (cm) is required and must be a number.");
    } else if (heightCm <= 0 || heightCm > 244) {
      errors.push("Height must be less than 244 cm (about 8 ft).");
    }

    if (prepTimeMinutes == null || Number.isNaN(prepTimeMinutes)) {
      errors.push("Prep time limit (minutes) is required and must be a number.");
    } else if (prepTimeMinutes <= 0 || prepTimeMinutes > 180) {
      errors.push("Prep time limit must be between 1 and 180 minutes.");
    }

    const allowedGenders = ["male", "female"];
    const normalizedGender =
      typeof gender === "string" ? gender.toLowerCase() : "";
    if (!allowedGenders.includes(normalizedGender)) {
      errors.push('Gender must be "male" or "female".');
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      errors.push("Ingredients must be a non-empty array of strings.");
    } else if (!ingredients.every((ing) => typeof ing === "string")) {
      errors.push("Each ingredient must be a string.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const prompt = `
You are FitFlux's AI Meal Planner.

User info:
- Weight: ${weightLbs} lbs
- Age: ${age}
- Height: ${heightCm} cm
- Gender: ${normalizedGender}
- Maximum prep time per meal: ${prepTimeMinutes} minutes
- Available ingredients (food/liquid related): ${ingredients.join(", ")}

Rules:
- Create a 1-day meal plan: breakfast, lunch, dinner, plus 0–2 snacks.
- Each meal MUST be possible using ONLY the ingredients list above plus basic pantry items (salt, pepper, common spices, oil, water).
- Prep time for each meal must NOT exceed ${prepTimeMinutes} minutes.
- Keep calories and portions realistic for the user; do not starve or overfeed.
- Focus on balanced nutrition and adequate protein.
- Use simple cooking methods and clear instructions.
- Do NOT give medical advice or diagnoses.
- Output ONLY valid JSON in the exact shape below, no extra commentary:

{
  "summary": "1– 2 sentence overview of the day",
  "estimated_total_calories": 0,
  "meals": [
    {
      "name": "Breakfast",
      "description": "Short description of the meal",
      "prep_time_minutes": 0,
      "calories": 0,
      "protein_g": 0,
      "carbs_g": 0,
      "fats_g": 0,
      "ingredients": ["..."],
      "instructions": "short prep instructions"
    }
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-5.2",
      input: prompt,
      text: {
        format: { type: "json_object" },
      },
    });

    const text = response.output_text;
    if (!text) {
      console.error("No text in GPT-5.2 response:", response);
      return NextResponse.json(
        { error: "No text returned from GPT-5.2" },
        { status: 500 }
      );
    }

    let plan;
    try {
      plan = JSON.parse(text);
    } catch (err) {
      console.error("AI returned invalid JSON:", err, text);
      return NextResponse.json(
        { error: "Invalid JSON from GPT-5.2", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Meal AI Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate meal plan",
        message: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
