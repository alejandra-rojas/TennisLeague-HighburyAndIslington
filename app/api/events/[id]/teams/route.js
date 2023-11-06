import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_, { params }) {
  //console.log("Received params:", params);
  const { id } = params;

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: "Missing or invalid id" }),
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

  const { data, error } = await supabase
    .from("event_teams")
    .select(
      `
      *,
      team:team_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      )
    `
    )
    .eq("event_id", id);

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

  const formattedData = data.map((entry) => {
    const { team } = entry;
    return {
      ...entry,
      player1name: team.player1
        ? `${team.player1.firstname} ${team.player1.lastname}`
        : null,
      player2name: team.player2
        ? `${team.player2.firstname} ${team.player2.lastname}`
        : null,
    };
  });

  return NextResponse.json({ data: formattedData });
}

export async function POST(request, { params }) {
  const { id } = params;
  //console.log(id);
  const { team } = await request.json();
  //console.log(team);

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("event_teams")
    .insert({
      event_id: id,
      team_id: team,
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
