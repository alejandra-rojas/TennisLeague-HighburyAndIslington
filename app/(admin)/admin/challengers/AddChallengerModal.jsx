"use client";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import NewChallengerModal from "./NewChallengerModal";

function AddChallengerModal({
  leagueID,
  leagueParticipants,
  setShowChallengerModal,
}) {
  const [searchString, setSearchString] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamSelection, setTeamSelection] = useState(true);
  const [newMatchModal, setNewMatchModal] = useState(false);
  const [error, setError] = useState(null);

  //Search for teams that are participating in the league
  const onSubmitSearchForm = (e) => {
    e.preventDefault();
    setSearchPerformed(true);
    handleSearch();
  };

  const handleSearch = () => {
    // Filter the teams data based on the search string
    const results = leagueParticipants.filter((team) => {
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

  // Add team to challenger match
  const addPlayer = (team) => {
    setError("");
    const playerExists = selectedTeams.some(
      (selectedTeam) => selectedTeam.team_id === team.team_id
    );

    if (!playerExists && selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, team]);
    } else if (selectedTeams.length === 2) {
      setError("A match can only have two teams");
      setTimeout(() => {
        setError("");
      }, 9000);
      console.log("You can't add more than two teams.");
    } else if (playerExists) {
      setError("This team is already selected");
      setTimeout(() => {
        setError("");
      }, 9000);
      console.log("This team is already selected.");
    }
  };
  //console.log(selectedTeams);

  //Remove player
  const removeTeam = (teamToRemove) => {
    const updatedPlayers = selectedTeams.filter(
      (team) => team !== teamToRemove
    );
    setSelectedTeams(updatedPlayers);
    setError("");
  };

  //CREATE MATCH
  const createChallengerMatch = () => {
    setTeamSelection(false);
    setNewMatchModal(true);
  };

  return (
    <section id="challenger-modal" className="new">
      <div className="new-challenge">
        <div className="header">
          <h4>Create a challenger match</h4>
          <button
            onClick={() => setShowChallengerModal(false)}
            aria-label="Close the create team modal"
          >
            <XMarkIcon width={25} />
            <span>close</span>
          </button>
        </div>

        {teamSelection && (
          <div className="participants-selection">
            {selectedTeams.length !== 0 && (
              <div className="match-selection">
                <h5>You are creating a challenger match with participants:</h5>
                <ul>
                  {selectedTeams.map((team) => (
                    <li key={team.team_id}>
                      <p>
                        <span>
                          {team.player1_firstname} {team.player1_lastname}
                        </span>
                        <span> & </span>
                        <span>
                          {team.player2_firstname} {team.player2_lastname}
                        </span>
                      </p>
                      <div
                        onClick={() => removeTeam(team)}
                        className="remove"
                        aria-label={`Remove ${team.player1_firstname} ${team.player2_firstname} from team`}
                      >
                        Remove team
                      </div>
                    </li>
                  ))}
                </ul>
                {error && (
                  <p className="error" aria-live="assertive">
                    {error}
                  </p>
                )}
                {selectedTeams.length === 2 && (
                  <button
                    onClick={createChallengerMatch}
                    aria-label="Create challenger match"
                  >
                    Create challenger match
                  </button>
                )}
              </div>
            )}

            <div className="participant-search">
              <form onSubmit={onSubmitSearchForm}>
                <input
                  type="text"
                  name="name"
                  placeholder="Search by participants name"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  aria-label="Search for participants by name"
                />
                <button
                  type="submit"
                  aria-label="Submit participant search"
                  disabled={!searchString}
                >
                  <MagnifyingGlassIcon width={25} />
                  <span>search</span>
                </button>
                <div className="clear-search">
                  {searchPerformed && filteredTeams.length >= 1 && (
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
                {searchPerformed && filteredTeams.length === 0 && (
                  <p className="error">{searchString} is not registered in this league</p>
                )}

                {searchPerformed && filteredTeams.length > 0 && (
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
                        <span>
                          <button
                            onClick={() => addPlayer(team)}
                            aria-label={`Add ${team.player1_firstname} ${team.player2_firstname} to team`}
                          >
                            Add team to challenger
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {newMatchModal && (
          <NewChallengerModal
            selectedTeams={selectedTeams}
            leagueID={leagueID}
            setShowChallengerModal={setShowChallengerModal}
          />
        )}
      </div>
    </section>
  );
}

export default AddChallengerModal;
