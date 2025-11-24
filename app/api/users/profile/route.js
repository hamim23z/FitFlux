import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Profile fetch error:", error);
      return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    // If no profile exists, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: session.user.id,
          display_name: session.user.name || session.user.email,
        })
        .select()
        .single();

      if (createError) {
        console.error("Create profile error:", createError);
        return Response.json(
          { error: "Failed to create profile" },
          { status: 500 }
        );
      }

      return Response.json({ success: true, profile: newProfile });
    }

    return Response.json({ success: true, profile });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { displayName, heightCm, sex, locale, tz } = await request.json();

    const { data: profile, error: updateError } = await supabase
      .from("user_profiles")
      .update({
        display_name: displayName,
        height_cm: heightCm,
        sex,
        locale,
        tz,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return Response.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return Response.json({
      success: true,
      profile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
