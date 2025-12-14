import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("provider_account_id", session.user.id)
    .single();

  if (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
  return Response.json(data);
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Only update fields that exist in the table
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        name: body.name,
        // Uncomment these after adding columns to the table:
        // phone: body.phone,
        // date_of_birth: body.date_of_birth,
        // height: body.height,
        // weight: body.weight,
        // fitness_goal: body.fitness_goal,
        // bio: body.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("provider_account_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return Response.json({ error: "Failed to update user" }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}