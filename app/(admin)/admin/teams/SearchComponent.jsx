"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchComponent({ setShowCreateTeamModal }) {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Getting players list -- Have created a GET endpoint in api/players
  /*   useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch("/api/players", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (response.ok) {
        setPlayers(result.data);
      } else {
        console.error(result.error);
      }
    };

    fetchPlayers();
  }, []); */

  //Get request using createClientComponentClient
  const supabase = createClientComponentClient();
  console.log(players);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("players").select();
      setPlayers(data);
    };

    getData();
  }, []);

  // Search for players form
  const onSubmitForm = (e) => {
    e.preventDefault(); // Prevent the default form submit action

    // Filter players based on searchString
    const matches = players.filter((player) =>
      `${player.firstname}${player.lastname}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );

    setFilteredPlayers(matches);
    setSearchPerformed(true); // Set that a search was performed
  };

  const clearSearchResults = () => {
    // setTeams([]);
    setSearchString("");
    setSearchPerformed(false);
  };

  // Add player to team
  const addPlayer = (player) => {
    setError("");
    const playerExists = selectedPlayers.some(
      (selectedPlayer) => selectedPlayer.id === player.id
    );

    if (!playerExists && selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, player]);
    } else if (selectedPlayers.length === 2) {
      setError("A team can only have two players");
      setTimeout(() => {
        setError("");
      }, 9000);
      console.log("You can't add more than two players.");
    } else if (playerExists) {
      setError("This player is already selected");
      setTimeout(() => {
        setError("");
      }, 9000);
      console.log("This player is already selected.");
    }
  };
  console.log(selectedPlayers);

  // Remove player from team
  const removePlayer = (playerToRemove) => {
    const updatedPlayers = selectedPlayers.filter(
      (player) => player !== playerToRemove
    );
    setSelectedPlayers(updatedPlayers);
    setError("");
  };

  // CREATE TEAM FETCH REQUEST
  const createTeam = async () => {
    setIsLoading(true);

    if (selectedPlayers.length !== 2) {
      console.log("You need to select exactly two players.");
      return;
    }
    const player1_id = selectedPlayers[0].id;
    const player2_id = selectedPlayers[1].id;

    const res = await fetch("http://localhost:3000/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player1_id,
        player2_id,
      }),
    });

    const json = await res.json();

    if (json.error) {
      //console.log(json.error.details);
      setError(json.error.details);
      setIsLoading(false);
      setTimeout(() => {
        setError("");
      }, 9000);
    }
    if (json.data) {
      //console.log(json.data);
      router.refresh();
      router.push("/admin/teams");
      setShowCreateTeamModal(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {selectedPlayers.length !== 0 && (
        <div className="team-creation">
          <h5>You are creating a team with players:</h5>
          <ul>
            {selectedPlayers.map((player) => (
              <li key={player.id}>
                <p>
                  {player.firstname} {player.lastname}
                </p>
                <div
                  onClick={() => removePlayer(player)}
                  className="remove"
                  aria-label={`Remove ${player.firstname} ${player.lastname} from team`}
                >
                  Remove player
                </div>
              </li>
            ))}
          </ul>
          {error && (
            <p className="error" aria-live="assertive">
              {error}
            </p>
          )}
          {!error && selectedPlayers.length === 2 && (
            <>
              <button
                disabled={isLoading}
                onClick={createTeam}
                aria-label="Create team"
              >
                {isLoading && <span>Creating...</span>}
                {!isLoading && <span>Create Team</span>}
              </button>
            </>
          )}
        </div>
      )}

      {selectedPlayers.length < 2 && (
        <>
          <form onSubmit={onSubmitForm}>
            <input
              type="text"
              name="name"
              placeholder="Search by players name"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              aria-label="Search for players by name"
            />
            <button
              type="submit"
              aria-label="Submit player search"
              disabled={!searchString}
            >
              <MagnifyingGlassIcon width={25} />
              <span>search</span>
            </button>
            <div className="clear-search">
              {searchPerformed && players.length >= 1 && (
                <button
                  onClick={clearSearchResults}
                  aria-label="Clear search results"
                >
                  <XMarkIcon width={20} />
                </button>
              )}
            </div>
          </form>

          <div className="search-results">
            {searchPerformed && filteredPlayers.length === 0 && (
              <p>No player found</p>
            )}

            {searchPerformed && filteredPlayers.length > 0 && (
              <ul>
                {filteredPlayers.map((player, index) => (
                  <li
                    key={player.id}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <span>
                      {player.firstname} {player.lastname}
                    </span>
                    <span>
                      <button
                        onClick={() => addPlayer(player)}
                        aria-label={`Add ${player.firstname} ${player.lastname} to team`}
                      >
                        Add player to team
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
