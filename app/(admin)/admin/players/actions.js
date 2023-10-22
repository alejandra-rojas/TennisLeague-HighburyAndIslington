//https://www.youtube.com/watch?v=QdxUZhLHZiA
//https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations
// in conjunction with newplayer.jsx

"use server";
import { redirect } from "next/navigation";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createPlayer(formData) {
  //console.log("formData", formData);

  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  //console.log("player:", firstName, lastName);

  const supabase = createServerActionClient({ cookies, headers });

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) return;
  //console.log(userData);

  const { data, error } = await supabase.from("players").insert({
    player_firstname: firstName,
    player_lastname: lastName,
  });

  console.log(data);

  if (error) {
    throw new Error("Could not create player");
  }
  if (!error) {
    revalidatePath("/players");
    redirect("/admin");
  }
}

export async function deletePlayer(id) {
  const supabase = createServerActionClient({ cookies, headers });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) return;

  const { error } = await supabase.from("players").delete().eq("player_id", id);

  if (error) {
    throw new Error("Could not delete player");
  }
  if (!error) {
    revalidatePath("/players");
    redirect("/admin");
  }
}
