import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope"); // 'training' or 'nutrition'
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (scope) {
      query = query.eq("scope", scope);
    }

    const { data: recommendations, error } = await query;

    if (error) {
      console.error("Recommendations fetch error:", error);
      return Response.json(
        { error: "Failed to fetch recommendations" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, recommendations });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
