import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Initialize Supabase client
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Fetch all leagues
  const { data, error } = await supabase.from("leagues").select("*");

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

export async function POST(request) {
  const { league } = await request.json();
  console.log(league);
  //get supabase instance
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //insert data
  const { data, error } = await supabase
    .from("leagues")
    .insert({
      league_name: league.league_name,
      starting_date: league.starting_date,
      midway_point: league.midway_point,
      end_date: league.end_date,
    })
    .select()
    .single();

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
