import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request, { params }) {
  const id = params.id;
  const challenger = await request.json();
  console.log(challenger);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("challenger_matches")
    .update({
      isfinished: challenger.data.isfinished,
      match_date: challenger.data.match_date,
      winner_id: challenger.data.winner_id,
      winner_score: challenger.data.winner_score,
      team1_bonus: challenger.data.team1_bonus,
      team2_bonus: challenger.data.team2_bonus,
    })
    .eq("match_id", id);

  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.json({ data });
}
