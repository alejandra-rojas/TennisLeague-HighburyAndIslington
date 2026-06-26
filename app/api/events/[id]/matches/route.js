import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: { message: "Missing or invalid id" } },
      { status: 400 }
    );
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      team1:team1_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      ),
      team2:team2_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      )
    `
    )
    .eq("event_id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

