import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const { player1_id, player2_id } = await request.json();

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("teams")
    .insert({
      player1_id: player1_id,
      player2_id: player2_id,
    })
    .select()
    .single();

  return NextResponse.json({ data, error });
}
