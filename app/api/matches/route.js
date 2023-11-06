import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const matches = body.matches;
    console.log("Received matches:", matches);

    // Get Supabase client for the authenticated user
    const cookieStore = cookies(request);
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Iterate over the matches data and insert them into the database
    // This assumes you want to insert multiple records
    const { data, error } = await supabase.from("matches").insert(matches);

    if (error) {
      throw new Error(error.message);
    }

    // Return the inserted data in the response
    return new NextResponse(JSON.stringify({ data }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error inserting matches:", error.message);
    // Return an error response
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

/* export async function GET() {
  // Initialize Supabase client
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Fetch all leagues
  const { data, error } = await supabase.from("leagues").select("*");

  // Return the data or error
  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.json({ data });
} */
