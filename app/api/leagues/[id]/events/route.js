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
    .select("*")
    .eq("league_id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(req, { params }) {
  const { id } = params;
  const event = await req.json();

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
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
