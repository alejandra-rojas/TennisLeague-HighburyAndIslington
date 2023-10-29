import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const player = await request.json();
  //get supabase instance
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //insert data
  const { data, error } = await supabase
    .from("players")
    .insert({
      ...player,
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}

//GET PLAYERS ENDPOINT FOR TEAMS/SEARCH COMPONENT -- CURRENTLY UNUSED AS USING CREATECLIENTCOMPONENTCLIENT
export async function GET() {
  // Initialize Supabase client
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Fetch all players
  const { data, error } = await supabase.from("players").select("*");

  // Return the data or error
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
