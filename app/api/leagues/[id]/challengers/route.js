import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSameDivisionChallengerMatch } from "../../../../challengers/challengerRules";

export async function GET(_, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: { message: "Missing or invalid league id" } },
      { status: 400 }
    );
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request, { params }) {
  const { id } = params;
  const challenger = await request.json();

  if (isSameDivisionChallengerMatch(challenger)) {
    return NextResponse.json(
      {
        error: {
          message: "Challenger matches must be between different divisions",
        },
      },
      { status: 400 }
    );
  }

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
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
