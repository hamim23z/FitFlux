import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { weight, height, age, goal, ingredients = [], dietPrefs = {}, restrictions = {} } = body;

    //CALORIE CALCULATOR FROM GOOGLE
    const weightKg = Number(weight) / 2.205 || 70;
    const heightCm = Number(height) || 170;
    const ageNum = Number(age) || 30;
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    let calories = bmr * 1.2;
    if (goal === "lose") calories -= 500;
    if (goal === "gain") calories += 300;
    calories = Math.max(1200, Math.round(calories));
    const protein = Math.max(60, Math.round(weightKg * 1.5));
    const fats = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fats * 9) / 4));

    const { data: recipes, error } = await supabase
      .from("food_catalog")
      .select("*")
      .limit(300);
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Database fetch failed" }, { status: 500 });
    }
    if (!recipes || recipes.length === 0) {
      return NextResponse.json({ error: "No recipes found" });
    }

    const userIngredients = ingredients.map((i) => i.trim().toLowerCase());
    const filtered = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients?.toLowerCase() || "";
      return userIngredients.some((ing) => recipeIngredients.includes(ing));
    });
    const finalList = filtered.length > 0 ? filtered : recipes;
    const randomRecipe = (list) => list[Math.floor(Math.random() * list.length)];
    const breakfast = randomRecipe(finalList);
    const lunch = randomRecipe(finalList);
    const dinner = randomRecipe(finalList);

    const formatMeal = (meal) => ({
      recipe_name: meal.recipe_name || "Unknown Recipe",
      ingredients: meal.ingredients || "",
      instructions: meal.instructions || "",
      url: meal.url || "",
      img_src: meal.img_src || "",
    });

    //DO NOT DELETE, NEED THIS FOR DEBUGGING
    console.log({
      ingredients,
      filteredLength: filtered.length,
      finalListLength: finalList.length,
      breakfast: breakfast.recipe_name,
      lunch: lunch.recipe_name,
      dinner: dinner.recipe_name,
    });

    return NextResponse.json({
      calories,
      macros: { protein, carbs, fats },
      goal,
      prefs: Object.entries(dietPrefs).filter(([, v]) => v).map(([k]) => k),
      restrictions: Object.entries(restrictions).filter(([, v]) => v).map(([k]) => k),
      meals: {
        breakfast: formatMeal(breakfast),
        lunch: formatMeal(lunch),
        dinner: formatMeal(dinner),
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}