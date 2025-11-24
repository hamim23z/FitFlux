import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weight, age, freeTime, prepTime, ingredients } = await request.json();

    // Validate inputs
    if (!weight || !age || !ingredients || ingredients.length === 0) {
      return Response.json(
        { error: "Missing required fields: weight, age, ingredients" },
        { status: 400 }
      );
    }

    // Calculate daily calorie needs (simplified Mifflin-St Jeor)
    const bmr = 10 * weight + 6.25 * (180) - 5 * age + 5; // Assuming 180cm height
    const tdee = Math.round(bmr * 1.55); // Moderate activity
    const dailyCals = Math.round(tdee / 7);

    // Fetch foods matching ingredients
    const { data: foods, error: foodError } = await supabase
      .from("food_catalog")
      .select("*")
      .ilike("name", `%${ingredients[0]}%`)
      .limit(5);

    if (foodError) {
      console.error("Food fetch error:", foodError);
      return Response.json({ error: "Failed to fetch foods" }, { status: 500 });
    }

    // Fetch recipes using available ingredients
    const { data: recipes, error: recipeError } = await supabase
      .from("recipes")
      .select("*, recipe_ingredients(*, food_catalog(*))")
      .eq("is_public", true)
      .limit(10);

    if (recipeError) {
      console.error("Recipe fetch error:", recipeError);
    }

    // Generate meal plan structure
    const mealPlan = {
      totalCalories: dailyCals,
      targetProtein: Math.round(weight * 0.8), // ~0.8g per lb
      targetCarbs: Math.round((dailyCals * 0.45) / 4),
      targetFat: Math.round((dailyCals * 0.35) / 9),
      prepTimeMinutes: parseInt(prepTime),
      meals: [
        {
          name: "Breakfast",
          timing: "7:00 AM",
          calorieTarget: Math.round(dailyCals * 0.25),
          suggestedRecipes: recipes?.slice(0, 3) || [],
        },
        {
          name: "Lunch",
          timing: "12:30 PM",
          calorieTarget: Math.round(dailyCals * 0.35),
          suggestedRecipes: recipes?.slice(3, 6) || [],
        },
        {
          name: "Dinner",
          timing: "6:00 PM",
          calorieTarget: Math.round(dailyCals * 0.35),
          suggestedRecipes: recipes?.slice(6, 9) || [],
        },
        {
          name: "Snack",
          timing: "3:00 PM",
          calorieTarget: Math.round(dailyCals * 0.05),
          suggestedRecipes: [],
        },
      ],
      availableIngredients: ingredients,
      prepTimeLimit: prepTime,
    };

    // Save recommendation to database
    const { error: saveError } = await supabase
      .from("recommendations")
      .insert({
        user_id: session.user.id,
        scope: "nutrition",
        input_snapshot: { weight, age, freeTime, prepTime, ingredients },
        plan: mealPlan,
        explanations: [
          `Based on your weight (${weight}lbs), we calculated your daily calorie needs at ${dailyCals} calories.`,
          `With ${prepTime} minutes prep time, we selected recipes that fit your schedule.`,
        ],
      });

    if (saveError) {
      console.error("Save error:", saveError);
    }

    return Response.json({
      success: true,
      mealPlan,
      message: "Meal plan generated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
