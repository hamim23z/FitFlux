export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const email = session.user.email;
  const { data: u, error: uErr } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (uErr) {
    return NextResponse.json({ error: uErr.message }, { status: 500 });
  }
  if (!u?.id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = u.id;
  const { data: sessions, error: sErr } = await supabaseAdmin
    .from("workout_sessions")
    .select("id")
    .eq("user_id", userId);

  if (sErr) {
    return NextResponse.json({ error: sErr.message }, { status: 500 });
  }

  const sessionIds = (sessions ?? []).map((x) => x.id);

  if (sessionIds.length) {
    const { error: wsErr } = await supabaseAdmin
      .from("workout_sets")
      .delete()
      .in("session_id", sessionIds);

    if (wsErr) {
      return NextResponse.json({ error: wsErr.message }, { status: 500 });
    }
  }

  const { error: delSessErr } = await supabaseAdmin
    .from("workout_sessions")
    .delete()
    .eq("user_id", userId);

  if (delSessErr) {
    return NextResponse.json({ error: delSessErr.message }, { status: 500 });
  }

  const { error: delUserErr } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", userId);

  if (delUserErr) {
    return NextResponse.json({ error: delUserErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}