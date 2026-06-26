import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const id = params.id;
  const supabase = await createClient();

  const { error } = await supabase.from("leagues").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error.message || "An error occurred while deleting the league.",
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true } });
}

export async function PUT(req, { params }) {
  const id = params.id;
  const league = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leagues")
    .update({
      league_name: league.league_name,
      starting_date: league.starting_date,
      midway_point: league.midway_point,
      end_date: league.end_date,
      isfinished: league.isfinished,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

