import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getPlayers() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase.from("players").select();

  if (error) {
    console.log(error.message);
  }
  return data;
}

export default async function PlayerList() {
  const players = await getPlayers();
  console.log(players);

  return (
    <>
      <div>hello</div>
      {players.map((player) => (
        <div key={player.player_id}>
          <p>
            {player.player_firstname}
            {player.player_lastname}
          </p>
        </div>
      ))}
      {players.length === 0 && <p>There are no players!</p>}
    </>
  );
}
