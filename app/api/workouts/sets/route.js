import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, exerciseId, setNumber, reps, loadKg, rpe } = await request.json();

    if (!sessionId || !exerciseId || !setNumber) {
      return Response.json(
        { error: "Missing required fields: sessionId, exerciseId, setNumber" },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const { data: workoutSession, error: sessionError } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", session.user.id)
      .single();

    if (sessionError || !workoutSession) {
      return Response.json(
        { error: "Workout session not found" },
        { status: 404 }
      );
    }

    // Insert workout set
    const { data: workoutSet, error: setError } = await supabase
      .from("workout_sets")
      .insert({
        session_id: sessionId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps: reps || null,
        load_kg: loadKg || null,
        rpe: rpe || null,
      })
      .select()
      .single();

    if (setError) {
      console.error("Insert set error:", setError);
      return Response.json(
        { error: "Failed to add workout set" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      set: workoutSet,
      message: "Workout set added successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const setId = searchParams.get("setId");

    if (!setId) {
      return Response.json({ error: "setId is required" }, { status: 400 });
    }

    // Verify the set belongs to user's session
    const { data: workoutSet, error: fetchError } = await supabase
      .from("workout_sets")
      .select("session_id")
      .eq("id", setId)
      .single();

    if (fetchError || !workoutSet) {
      return Response.json({ error: "Set not found" }, { status: 404 });
    }

    const { data: workoutSession } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("id", workoutSet.session_id)
      .eq("user_id", session.user.id)
      .single();

    if (!workoutSession) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the set
    const { error: deleteError } = await supabase
      .from("workout_sets")
      .delete()
      .eq("id", setId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return Response.json({ error: "Failed to delete set" }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Workout set deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
