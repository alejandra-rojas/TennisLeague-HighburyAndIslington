import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const id = params.id;
  //get supabase instance
  const supabase = await createClient();

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

