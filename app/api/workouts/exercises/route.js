import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const muscleGroup = searchParams.get("muscleGroup");
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "50");

    let exerciseQuery = supabase
      .from("exercise_catalog")
      .select("*")
      .eq("is_active", true);

    if (muscleGroup) {
      exerciseQuery = exerciseQuery.eq("muscle_group", muscleGroup);
    }

    if (query) {
      exerciseQuery = exerciseQuery.ilike("name", `%${query}%`);
    }

    const { data: exercises, error } = await exerciseQuery.limit(limit);

    if (error) {
      console.error("Exercise fetch error:", error);
      return Response.json({ error: "Failed to fetch exercises" }, { status: 500 });
    }

    return Response.json({ success: true, exercises });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
