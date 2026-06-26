import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = await params;
  const challenger = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("challenger_matches")
    .update({
      isfinished: challenger.isfinished,
      match_date: challenger.match_date,
      winner_id: challenger.winner_id,
      winner_score: challenger.winner_score,
      team1_bonus: challenger.team1_bonus,
      team2_bonus: challenger.team2_bonus,
    })
    .eq("match_id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

