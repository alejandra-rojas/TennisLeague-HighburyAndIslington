import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
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
