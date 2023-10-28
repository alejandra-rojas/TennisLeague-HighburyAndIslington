import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EditButton from "./EditButton";

async function getTeams() {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase.from("teams").select(`
      team_id,
      player1_id,
      player2_id,
      player1:players!player1_id (
        firstname,
        lastname
      ),
      player2:players!player2_id (
        firstname,
        lastname
      )
    `);

  if (error) {
    console.log(error.message);
    return null;
  }

  // Reformat data to match original SQL structure
  const formattedData = data.map((team) => ({
    team_id: team.team_id,
    player1_id: team.player1_id,
    player2_id: team.player2_id,
    player1_firstname: team.player1.firstname,
    player1_lastname: team.player1.lastname,
    player2_firstname: team.player2.firstname,
    player2_lastname: team.player2.lastname,
  }));

  return formattedData;
}

export default async function TeamsList() {
  const teams = await getTeams();
  //console.log(teams);

  return (
    <ul className="teams-list">
      {teams.map((team, index) => (
        <li
          key={team.team_id}
          className={`${index % 2 === 0 ? "even-row" : "odd-row"}`}
        >
          <p>
            {team.player1_firstname}&#160;
            {team.player1_lastname}
            &#160; & {team.player2_firstname}&#160;
            {team.player2_lastname}
          </p>
          <EditButton team={team} id={team.team_id} />
        </li>
      ))}
      {teams.length === 0 && <p>There are no teams registered!</p>}
    </ul>
  );
}
