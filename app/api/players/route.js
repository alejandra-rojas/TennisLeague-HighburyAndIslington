import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const player = await request.json();
  //get supabase instance
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //insert data
  const { data, error } = await supabase
    .from("players")
    .insert({
      ...player,
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
