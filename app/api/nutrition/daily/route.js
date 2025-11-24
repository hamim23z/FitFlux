import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get or create nutrition day
    let { data: nutritionDay, error: dayError } = await supabase
      .from("nutrition_days")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("date", date)
      .single();

    if (!nutritionDay && !dayError) {
      const { data: newDay, error: createError } = await supabase
        .from("nutrition_days")
        .insert({
          user_id: session.user.id,
          date,
        })
        .select()
        .single();

      if (createError) {
        console.error("Create day error:", createError);
        return Response.json(
          { error: "Failed to create nutrition day" },
          { status: 500 }
        );
      }

      nutritionDay = newDay;
    }

    // Fetch nutrition items for the day
    const { data: items, error: itemsError } = await supabase
      .from("nutrition_items")
      .select(
        `
        *,
        food_catalog(name, kcals_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g),
        recipes(name, recipe_ingredients(food_catalog(*)))
      `
      )
      .eq("day_id", nutritionDay.id);

    if (itemsError) {
      console.error("Items fetch error:", itemsError);
      return Response.json(
        { error: "Failed to fetch nutrition items" },
        { status: 500 }
      );
    }

    // Calculate totals
    const totals = items.reduce(
      (acc, item) => {
        const grams = item.grams;
        if (item.food_catalog) {
          const food = item.food_catalog;
          acc.kcals += (food.kcals_per_100g * grams) / 100;
          acc.protein += (food.protein_per_100g * grams) / 100;
          acc.carbs += (food.carbs_per_100g * grams) / 100;
          acc.fat += (food.fat_per_100g * grams) / 100;
        }
        return acc;
      },
      { kcals: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return Response.json({
      success: true,
      nutritionDay,
      items,
      totals: {
        kcals: Math.round(totals.kcals),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, foodId, recipeId, grams } = await request.json();

    if (!date || (!foodId && !recipeId) || !grams) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create nutrition day
    let { data: nutritionDay, error: dayError } = await supabase
      .from("nutrition_days")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("date", date)
      .single();

    if (!nutritionDay) {
      const { data: newDay, error: createError } = await supabase
        .from("nutrition_days")
        .insert({
          user_id: session.user.id,
          date,
        })
        .select()
        .single();

      if (createError) {
        return Response.json(
          { error: "Failed to create nutrition day" },
          { status: 500 }
        );
      }

      nutritionDay = newDay;
    }

    // Insert nutrition item
    const { data: item, error: itemError } = await supabase
      .from("nutrition_items")
      .insert({
        day_id: nutritionDay.id,
        food_id: foodId || null,
        recipe_id: recipeId || null,
        grams,
      })
      .select()
      .single();

    if (itemError) {
      console.error("Insert error:", itemError);
      return Response.json(
        { error: "Failed to add nutrition item" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      item,
      message: "Nutrition item added successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
