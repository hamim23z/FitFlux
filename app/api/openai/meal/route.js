import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

const MAX_INGREDIENTS = 25;
const MAX_ING_LEN = 40;

function clampInt(n, min = 0, max = Number.POSITIVE_INFINITY) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  const r = Math.round(x);
  if (r < min || r > max) return null;
  return r;
}

function cleanIngredients(arr) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    if (typeof item !== "string") continue;
    let s = item.trim().toLowerCase();
    if (!s) continue;
    s = s.replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim();
    if (s.length < 2 || s.length > MAX_ING_LEN) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= MAX_INGREDIENTS) break;
  }
  return out;
}

function lbsToKg(lbs) {
  return lbs * 0.45359237;
}

function mifflinStJeorBmr({ weightLbs, heightCm, age, gender }) {
  const kg = lbsToKg(weightLbs);
  const base = 10 * kg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function activityFactorFromGoal(goal) {
  return 1.55;
}

function clampNumber(n, min = 0, max = Number.POSITIVE_INFINITY) {
  n = Number(n);
  if (!Number.isFinite(n)) return min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function computeTargets({ weightLbs, heightCm, age, gender, goal }) {
  const bmr = mifflinStJeorBmr({ weightLbs, heightCm, age, gender });
  const af = activityFactorFromGoal(goal);
  const tdee = bmr * af;

  let calorieTarget;
  if (goal === "lose") calorieTarget = tdee - 400;
  else if (goal === "gain") calorieTarget = tdee + 250;
  else calorieTarget = tdee;

  calorieTarget = Math.round(clampNumber(calorieTarget, 1200, 4500));

  const proteinPerLb = goal === "lose" ? 1.0 : goal === "gain" ? 0.85 : 0.85;
  const fatPerLb = 0.35;

  let proteinG = Math.round(clampNumber(weightLbs * proteinPerLb, 90, 260));
  let fatG = Math.round(clampNumber(weightLbs * fatPerLb, 40, 140));

  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const remaining = Math.max(0, calorieTarget - (proteinCals + fatCals));
  let carbsG = Math.round(remaining / 4);

  return {
    calories: calorieTarget,
    protein_g: proteinG,
    carbs_g: carbsG,
    fats_g: fatG,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    activity_factor: af,
  };
}

function normalizeMeal(m) {
  const safeStr = (v, fallback = "") => (typeof v === "string" ? v : fallback);

  return {
    name: safeStr(m?.name, "Meal"),
    description: safeStr(m?.description, ""),
    prep_time_minutes: Math.max(0, Math.round(Number(m?.prep_time_minutes) || 0)),
    calories: Math.max(0, Math.round(Number(m?.calories) || 0)),
    protein_g: Math.max(0, Math.round(Number(m?.protein_g) || 0)),
    carbs_g: Math.max(0, Math.round(Number(m?.carbs_g) || 0)),
    fats_g: Math.max(0, Math.round(Number(m?.fats_g) || 0)),
    ingredients: Array.isArray(m?.ingredients)
      ? m.ingredients.filter((x) => typeof x === "string").slice(0, 40)
      : [],
    instructions: safeStr(m?.instructions, ""),
  };
}

function totalsFromMeals(meals) {
  return meals.reduce(
    (acc, m) => {
      acc.calories += Number(m.calories) || 0;
      acc.protein_g += Number(m.protein_g) || 0;
      acc.carbs_g += Number(m.carbs_g) || 0;
      acc.fats_g += Number(m.fats_g) || 0;
      return acc;
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0 }
  );
}

function buildPrompt({
  weightLbs,
  age,
  heightCm,
  gender,
  prepTimeMinutes,
  ingredients,
  goal,
  targets,
}) {
  return `
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
- Gender: ${gender}
- Goal: ${goal}
- Maximum prep time per meal: ${prepTimeMinutes} minutes
- Available ingredients: ${ingredients.join(", ")}

Targets (for the full day):
- Calories target: ${targets.calories} kcal
- Protein target: ${targets.protein_g} g
- Carbs target: ${targets.carbs_g} g
- Fats target: ${targets.fats_g} g

Rules:
- Create a 1-day meal plan: Breakfast, Lunch, Dinner, plus 0–2 Snacks.
- Each meal MUST be possible using ONLY the ingredients list above plus basic pantry items (salt, pepper, common spices, oil, water).
- Prep time for each meal must NOT exceed ${prepTimeMinutes} minutes.
- Keep calories and portions realistic for the user.
- Focus on balanced nutrition and adequate protein.
- Keep the day's total calories and macros reasonably close to the targets above.
- All numeric fields must be non-negative integers.
- Output ONLY valid JSON in the exact shape below, with no extra keys and no extra commentary:

{
  "summary": "1–2 sentence overview of the day",
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
}

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
      goal = "maintain",
    } = body || {};

    const errors = [];

    const w = clampInt(weightLbs, 60, 450);
    if (w == null) errors.push("Weight (lbs) must be a number between 60 and 450.");

    const a = clampInt(age, 13, 80);
    if (a == null) errors.push("Age must be a number between 13 and 80.");

    const h = clampInt(heightCm, 120, 225);
    if (h == null) errors.push("Height (cm) must be a number between 120 and 225.");

    const pt = clampInt(prepTimeMinutes, 5, 180);
    if (pt == null) errors.push("Prep time limit must be between 5 and 180 minutes.");

    const allowedGenders = ["male", "female"];
    const g = typeof gender === "string" ? gender.toLowerCase() : "";
    if (!allowedGenders.includes(g)) errors.push('Gender must be "male" or "female".');

    const allowedGoals = ["lose", "maintain", "gain"];
    const goalNorm =
      typeof goal === "string" && allowedGoals.includes(goal) ? goal : "maintain";

    const ing = cleanIngredients(ingredients);
    if (ing.length === 0) errors.push("Ingredients must be a non-empty array of food-related strings.");

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const targets = computeTargets({
      weightLbs: w,
      heightCm: h,
      age: a,
      gender: g,
      goal: goalNorm,
    });

    const prompt = buildPrompt({
      weightLbs: w,
      age: a,
      heightCm: h,
      gender: g,
      prepTimeMinutes: pt,
      ingredients: ing,
      goal: goalNorm,
      targets,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let text;
    try {
      const response = await openai.responses.create(
        {
          model: "gpt-5.2",
          input: prompt,
          text: { format: { type: "json_object" } },
        },
        { signal: controller.signal }
      );
      text = response.output_text;
    } finally {
      clearTimeout(timeout);
    }

    if (!text) {
      return NextResponse.json({ error: "No text returned from model" }, { status: 500 });

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
