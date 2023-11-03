import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(_, { params }) {
  //console.log("Received params:", params);
  const { id } = params;

  if (!id) {
    // Handle the case where 'id' is not defined or not passed correctly
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
  // Initialize Supabase client
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Fetch all events with specific league_id
  const { data, error } = await supabase
    .from("events")
    .select("*")
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

  return NextResponse.json({ data });
}

export async function POST(req, { params }) {
  const { id } = params;
  const { event } = await req.json();
  console.log(event);

  //get supabase instance
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("events")
    .insert({
      league_id: id,
      event_name: event.event_name,
      midway_matches: event.midway_matches,
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
