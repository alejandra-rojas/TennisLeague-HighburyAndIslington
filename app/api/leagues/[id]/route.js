import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(_, { params }) {
  const id = params.id;
  //get supabase instance
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //insert data
  const { error } = await supabase.from("leagues").delete().eq("id", id);

  return NextResponse.json({ error });
}

export async function PUT(req, { params }) {
  const id = params.id;
  const { league } = await req.json();
  //console.log(league);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.json({ data });
}
