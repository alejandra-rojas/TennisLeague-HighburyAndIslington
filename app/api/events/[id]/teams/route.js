import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: { message: "Missing or invalid id" } },
      { status: 400 }
    );
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_teams")
    .select(
      `
      *,
      team:team_id (
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

  const formattedData = data.map((entry) => {
    const { team } = entry;
    return {
      ...entry,
      player1name: team.player1
        ? `${team.player1.firstname} ${team.player1.lastname}`
        : null,
      player2name: team.player2
        ? `${team.player2.firstname} ${team.player2.lastname}`
        : null,
    };
  });

  return NextResponse.json({ data: formattedData });
}

export async function POST(request, { params }) {
  const { id } = params;
  const { team_id } = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_teams")
    .insert({
      event_id: id,
      team_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

