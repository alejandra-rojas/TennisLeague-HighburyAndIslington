import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(_, { params }) {
  const id = params.id;
  //get supabase instance
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  //insert data
  const { error } = await supabase.from("teams").delete().eq("team_id", id);

  if (error) {
    return NextResponse.json(
      {
        error: {
          message: error.message || "An error occurred while deleting the team.",
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true } });
}
