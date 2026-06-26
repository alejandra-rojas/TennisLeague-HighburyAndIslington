import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("leagues").select("*");

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request) {
  const league = await request.json();
  const supabase = await createClient();

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
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

