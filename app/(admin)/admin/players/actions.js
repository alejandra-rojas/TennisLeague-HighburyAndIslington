//https://www.youtube.com/watch?v=QdxUZhLHZiA
//https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations
// in conjunction with newplayer.jsx

"use server";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

export async function createPlayer(formData) {
  //console.log("formData", formData);

  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  //console.log("player:", firstName, lastName);

  const supabase = createServerComponentClient({ cookies, headers });

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) return;
  //console.log(userData);

  const { data, error } = await supabase.from("players").insert({
    player_firstname: firstName,
    player_lastname: lastName,
  });

  console.log(data);

  if (!error) {
    redirect("/admin");
  }
}

export async function getPlayers() {}
