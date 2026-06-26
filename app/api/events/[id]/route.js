import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("event_id", id);

  if (error) {
    return NextResponse.json(
      {
        error: {
          message: error.message || "An error occurred while deleting the event.",
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true } });
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const event = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .update({
      event_name: event.event_name,
      midway_matches: event.midway_matches,
    })
    .eq("event_id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

