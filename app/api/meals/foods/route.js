import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    let foodQuery = supabase.from("food_catalog").select("*").eq("is_active", true);

    if (query) {
      foodQuery = foodQuery.ilike("name", `%${query}%`);
    }

    const { data: foods, error } = await foodQuery.limit(limit);

    if (error) {
      console.error("Food fetch error:", error);
      return Response.json({ error: "Failed to fetch foods" }, { status: 500 });
    }

    return Response.json({ success: true, foods });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
