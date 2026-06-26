import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("teams").select(`
    team_id,
    player1_id,
    player2_id,
    player1:players!player1_id (
      firstname,
      lastname
    ),
    player2:players!player2_id (
      firstname,
      lastname
    )
  `);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      {
        status: 500,
      }
    );
  }

  const formattedData = data.map((team) => ({
    team_id: team.team_id,
    player1_id: team.player1_id,
    player2_id: team.player2_id,
    player1_firstname: team.player1.firstname,
    player1_lastname: team.player1.lastname,
    player2_firstname: team.player2.firstname,
    player2_lastname: team.player2.lastname,
  }));

  return NextResponse.json({ data: formattedData });
}

export async function POST(request) {
  const { player1_id, player2_id } = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .insert({
      player1_id: player1_id,
      player2_id: player2_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        error: {
          message: error.details || error.message,
          code: error.code,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

