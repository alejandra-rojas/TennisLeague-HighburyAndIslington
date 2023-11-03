import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(_, { params }) {
  //console.log("Received params:", params);
  const id = params.id;
  //get supabase instance
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //insert data
  const { error } = await supabase.from("events").delete().eq("event_id", id);

  return NextResponse.json({ error });
}

export async function PUT(req, { params }) {
  const id = params.id;
  const { event } = await req.json();
  //console.log(event);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("events")
    .update({
      event_name: event.event_name,
      midway_matches: event.midway_matches,
    })
    .eq("event_id", id);

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
