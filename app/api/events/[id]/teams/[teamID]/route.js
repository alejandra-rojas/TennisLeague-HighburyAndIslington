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
