import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const id = params.id;
  const supabase = await createClient();

  const { error } = await supabase.from("players").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return NextResponse.json(
        {
          error: {
            message:
              "Cannot delete player. They are still referenced in one or more matches.",
            code: error.code,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "An error occurred while deleting the player.",
          code: error.code,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: { success: true } });
}

export async function PUT(req, { params }) {
  const player = await req.json();
  const id = params.id;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("players")
    .update({ firstname: player.firstname, lastname: player.lastname })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

