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