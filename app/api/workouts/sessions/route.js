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

    const { data: session_data, error } = await supabase
      .from("workout_sessions")
      .select(
        `
        *,
        workout_sets(
          *,
          exercise_catalog(name, muscle_group, equipment)
        )
      `
      )
      .eq("user_id", session.user.id)
      .eq("session_date", date)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Session fetch error:", error);
      return Response.json({ error: "Failed to fetch workout session" }, { status: 500 });
    }

    return Response.json({
      success: true,
      session: session_data || null,
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

    const { date, notes } = await request.json();

    if (!date) {
      return Response.json({ error: "Date is required" }, { status: 400 });
    }

    // Check if session exists for this date
    let { data: existingSession } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("session_date", date)
      .single();

    if (existingSession) {
      return Response.json({
        success: true,
        session: existingSession,
        message: "Session already exists for this date",
      });
    }

    // Create new session
    const { data: newSession, error: createError } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: session.user.id,
        session_date: date,
        notes: notes || "",
      })
      .select()
      .single();

    if (createError) {
      console.error("Create session error:", createError);
      return Response.json(
        { error: "Failed to create workout session" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      session: newSession,
      message: "Workout session created successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
