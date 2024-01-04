import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(req, { params }) {
  const id = params.id;
  const { match } = await req.json();
  console.log(match);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
 
  return NextResponse.json({ data });
}
