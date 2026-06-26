import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const { id, teamID } = params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("event_teams")
    .delete()
    .eq("event_id", id)
    .eq("team_id", teamID);

  if (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error.message ||
            "An error occurred while removing the team from the event.",
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true } });
}

export async function PUT(req, { params }) {
  const eventID = params.id;
  const teamID = params.teamID;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_teams")
    .update({
      team_withdrawn: true,
    })
    .eq("event_id", eventID)
    .eq("team_id", teamID);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: { message: matchesError.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      eventTeams: data,
      matches,
    },
  });
}

