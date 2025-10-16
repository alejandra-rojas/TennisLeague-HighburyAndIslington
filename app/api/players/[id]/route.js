import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(_, { params }) {
  const id = params.id;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Try to delete the player
  const { error } = await supabase.from("players").delete().eq("id", id);

  if (error) {
    // Check for foreign key constraint violation
    if (error.code === "23503") {
      return NextResponse.json(
        {
          message:
            "Cannot delete player. They are still referenced in one or more matches.",
          code: error.code,
        },
        { status: 400 }
      );
    }

    // Other types of errors
    return NextResponse.json(
      {
        message: "An error occurred while deleting the player.",
        code: error.code,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
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
