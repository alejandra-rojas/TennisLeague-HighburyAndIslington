import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const player = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("players")
    .insert({
      ...player,
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

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("players").select("*");

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

