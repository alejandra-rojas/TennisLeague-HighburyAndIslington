"use client";
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";

function PlayerSearch({ registeredTeams, event }) {
  const queryClient = useQueryClient();
  const [searchString, setSearchString] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [error, setError] = useState("");

  const {
    data: allTeamsData,
    isLoading,
  } = useQuery({
    queryKey: ["all-teams"],
    queryFn: async () => {
      const response = await axios.get("/api/teams");
      return response.data.data;
    },
  });

  const onSubmitSearchForm = (e) => {
    e.preventDefault();
    setSearchPerformed(true);
    handleSearch();
  };

  const handleSearch = () => {
    if (isLoading || !allTeamsData) {
      return;
    }

    const results = allTeamsData.filter((team) => {
      const searchLower = searchString.toLowerCase();
      return (
        team.player1_firstname.toLowerCase().includes(searchLower) ||
        team.player1_lastname.toLowerCase().includes(searchLower) ||
        team.player2_firstname.toLowerCase().includes(searchLower) ||
        team.player2_lastname.toLowerCase().includes(searchLower)
      );
    });

    setFilteredTeams(results);
  };

  const clearSearchResults = () => {
    setSearchString("");
    setSearchPerformed(false);
    setFilteredTeams([]);
  };

  const { mutate: addTeam } = useMutation({
    mutationFn: async (team_id) =>
      await axios.post(`/api/events/${event}/teams`, {
        team_id,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-participants", event] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleAddTeam = (team) => {
    const isTeamAlreadyAdded = registeredTeams.some(
      (existingTeam) => existingTeam.team_id === team
    );

    if (isTeamAlreadyAdded) {
      setError(`Selected team has already been added to the event.`);

      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      setError("");
      addTeam(team);
    }
  };

  return (
    <>
      {isLoading && <div>Fetching database data</div>}
      {!isLoading && (
        <section id="player-search">
          <div className="search-input">
            <form onSubmit={onSubmitSearchForm}>
              <input
                type="text"
                id="searchInput"
                name="name"
                placeholder="Search by participant's name:"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              ></input>

              <button
                type="submit"
                aria-label="Submit search"
                disabled={!searchString}
              >
                <MagnifyingGlassIcon width={25} />
                <span>search</span>
              </button>
              <div className="clear-search">
                {searchPerformed && (
                  <button
                    type="button"
                    onClick={clearSearchResults}
                    aria-label="Clear search results"
                  >
                    <XMarkIcon width={20} />
                  </button>
                )}
              </div>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
          {searchPerformed && filteredTeams.length >= 1 && (
            <div className="search-results">
              <h5>Search results:</h5>
              <ul>
                {filteredTeams.map((team, index) => (
                  <li
                    key={team.team_id}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <span>
                      {team.player1_firstname} {team.player1_lastname}
                    </span>
                    <span>&</span>
                    <span>
                      {team.player2_firstname} {team.player2_lastname}
                    </span>

                    <button
                      onClick={() => handleAddTeam(team.team_id)}
                      aria-label={`Add team ${team.player1_firstname} ${team.player1_lastname} & ${team.player2_firstname} ${team.player2_lastname} to event`}
                    >
                      Add team to event
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {searchPerformed && filteredTeams.length === 0 && (
            <p className="error">
              No results! You can add a new participant to the database via the
              players page
            </p>
          )}
        </section>
      )}
    </>
  );
}

export default PlayerSearch;
