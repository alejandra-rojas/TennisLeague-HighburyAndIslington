// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { TrashIcon } from "@heroicons/react/24/solid";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SearchComponent from "./SearchComponent";

export default function CreateTeam({ setShowCreateTeamModal }) {
  /*   const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [error, setError] = useState(null);
 */
  return (
    <div className="new-team-modal">
      <div className="controls">
        <h3>Create new team</h3>
        <button
          aria-label={`Close create team modal`}
          onClick={() => {
            setShowCreateTeamModal(false);
          }}
        >
          <XMarkIcon width={25} />
          <span>close</span>
        </button>
      </div>

      {/* {selectedPlayers.length !== 0 && (
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
          {selectedPlayers.length === 2 && (
            <button onClick={createTeam} aria-label="Create team">
              Create team
            </button>
          )}
        </div>
      )}
 */}

      <SearchComponent setShowCreateTeamModal={setShowCreateTeamModal} />
    </div>
  );
}
