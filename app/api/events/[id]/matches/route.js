import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: { message: "Missing or invalid id" } },
      { status: 400 }
    );
  }
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      team1:team1_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      ),
      team2:team2_id (
        *,
        player1:player1_id (firstname, lastname),
        player2:player2_id (firstname, lastname)
      )
    `
    )
    .eq("event_id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
