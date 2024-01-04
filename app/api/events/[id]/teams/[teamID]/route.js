import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
 
export async function DELETE(_, { params }) {
  const { id, teamID } = params;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { error } = await supabase
    .from("event_teams")
    .delete()
    .eq("event_id", id)
    .eq("team_id", teamID);

  return NextResponse.json({ error });
}

export async function PUT(req, { params }) {
  const eventID = params.id;
  const teamID = params.teamID;
  console.log(params)

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("event_teams")
    .update({
      team_withdrawn: true,
    })
    .eq("event_id", eventID)
    .eq("team_id", teamID);

  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .update({
      withdrawal: true,
      team1_sets: 0,
      team2_sets: 0,
      winner_score: "withdrawn",
    })
    .eq("event_id", eventID)
    .or(`team1_id.eq.${teamID},team2_id.eq.${teamID}`);

  if (matchesError) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.json({ data, matches });
}

/* //WITHDRAW TEAM FROM EVENT - RESET TEAM SETS
app.put("/events/:id/teams/:tid", async (req, res) => {
  const { id, tid } = req.params;

  try {
    // Check if the withdrawn team was the last opponent for any other team
    const lastOpponentQuery = `
      SELECT et.team_id
      FROM event_teams et
      WHERE et.event_id = $1
        AND NOT et.team_withdrawn
        AND et.team_id != $2
        AND et.team_id NOT IN (
          SELECT DISTINCT CASE WHEN m.team1_id = $2 THEN m.team2_id ELSE m.team1_id END
          FROM matches m
          WHERE m.event_id = $1
            AND NOT m.withdrawal
        )
    `;
    const lastOpponentResult = await pool.query(lastOpponentQuery, [id, tid]);

    if (lastOpponentResult.rows.length > 0) {
      // if the withdrawn team was the last opponent for other team(s)
      // update those team(s) as if they have completed all non-withdrawn matches
      for (const row of lastOpponentResult.rows) {
        await pool.query(
          "UPDATE event_teams SET completed_notwithdrawnmatches = notwithdrawn_totalmatches WHERE event_id = $1 AND team_id = $2",
          [id, row.team_id]
        );
      }
    }

    
});
 */
