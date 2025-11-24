import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return Response.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const { data: metrics, error } = await supabase
      .from("body_metrics")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      console.error("Metrics fetch error:", error);
      return Response.json({ error: "Failed to fetch metrics" }, { status: 500 });
    }

    return Response.json({ success: true, metrics });
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

    const { date, weightKg, bodyFatPct, steps } = await request.json();

    if (!date) {
      return Response.json({ error: "Date is required" }, { status: 400 });
    }

    const { data: metric, error } = await supabase
      .from("body_metrics")
      .upsert(
        {
          user_id: session.user.id,
          date,
          weight_kg: weightKg || null,
          body_fat_pct: bodyFatPct || null,
          steps: steps || null,
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    if (error) {
      console.error("Upsert error:", error);
      return Response.json({ error: "Failed to save metrics" }, { status: 500 });
    }

    return Response.json({
      success: true,
      metric,
      message: "Body metrics saved successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
