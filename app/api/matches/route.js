import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { matches } = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase.from("matches").insert(matches);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}

