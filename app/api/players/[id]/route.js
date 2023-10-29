import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(_, { params }) {
  const id = params.id;
  //get supabase instance
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //delete data
  const { error } = await supabase.from("players").delete().eq("id", id);

  return NextResponse.json({ error });
}

export async function PUT(req, { params }) {
  const player = await req.json();
  const id = params.id;

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("players")
    .update({ firstname: player.firstname, lastname: player.lastname })
    .eq("id", id);

  return NextResponse.json({ data, error });
}
