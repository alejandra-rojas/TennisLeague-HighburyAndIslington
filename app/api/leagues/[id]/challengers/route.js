import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_, { params }) {
  //console.log("Received params:", params);
  const { id } = params;

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: "Missing or invalid league id" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Fetch all events with specific league_id
  const { data, error } = await supabase
    .from("challenger_matches")
    .select(
      `*,
        team1:team1_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      ),
      team2:team2_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      )`
    )
    .eq("league_id", id);

  // Return the data or error
  if (error) {
    console.error("Error fetching events:", error);
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.json({ data });
}

export async function POST(request, { params }) {
  const { id } = params;
  const { challenger } = await request.json();

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("challenger_matches")
    .insert({
      league_id: id,
      team1_id: challenger.team1_id,
      team1_event_id: challenger.team1_event_id,
      team2_id: challenger.team2_id,
      team2_event_id: challenger.team2_event_id,
      isfinished: challenger.isfinished,
      match_date: challenger.match_date,
      winner_id: challenger.winner_id,
      winner_score: challenger.winner_score,
      team1_bonus: challenger.team1_bonus,
      team2_bonus: challenger.team2_bonus,
    })
    .select()
    .single();

  if (error) {
    console.error("Error fetching events:", error);
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return NextResponse.json({ data, error });
}
