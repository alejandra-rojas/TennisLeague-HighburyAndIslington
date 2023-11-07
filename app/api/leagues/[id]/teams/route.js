import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_, { params }) {
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

  // Modify the query to perform a join with the event_teams table
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      
    event_teams!inner(
      event_id,
      team_id,
      team:teams!inner(
        player1:players!player1_id(firstname, lastname),
        player2:players!player2_id(firstname, lastname)
      )
    )
  `
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

  const uniqueTeams = new Set();
  const teamsData = data.reduce((acc, event) => {
    const teams = event.event_teams
      .filter((team) => {
        const isDuplicate = uniqueTeams.has(team.team_id);
        uniqueTeams.add(team.team_id);
        return !isDuplicate;
      })
      .map((team) => ({
        team_id: team.team_id,
        event_id: team.event_id,
        player1_firstname: team.team.player1.firstname,
        player1_lastname: team.team.player1.lastname,
        player2_firstname: team.team.player2.firstname,
        player2_lastname: team.team.player2.lastname,
      }));

    return [...acc, ...teams];
  }, []);

  return NextResponse.json({ data: teamsData });
}

// ` event_teams!inner(team_id)       `;
