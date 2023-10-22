import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

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
    <ul className="players-list">
      {players.map((player, index) => (
        <li
          key={player.id}
          className={`${index % 2 === 0 ? "even-row" : "odd-row"}`}
        >
          <p>
            {player.firstname}
            &#160;
            {player.lastname}
          </p>
          <EditButton player={player} id={player.id} />
          {/* <DeleteButton id={player.id} /> */}
        </li>
      ))}
      {players.length === 0 && <p>There are no players!</p>}
    </ul>
  );
}
