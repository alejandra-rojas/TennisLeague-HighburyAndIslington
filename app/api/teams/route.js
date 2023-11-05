import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

  return new NextResponse(JSON.stringify(formattedData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request) {
  const { player1_id, player2_id } = await request.json();

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("teams")
    .insert({
      player1_id: player1_id,
      player2_id: player2_id,
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
