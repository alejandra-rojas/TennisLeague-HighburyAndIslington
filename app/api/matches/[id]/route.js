import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = await params;
  const match = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("matches")
    .update({
      match_date: match.match_date,
      isfinished: match.isfinished,
      winner_id: match.winner_id,
      team1_sets: match.team1_sets,
      team2_sets: match.team2_sets,
      winner_score: match.winner_score,
      bymidpoint: match.byMidpoint,
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

