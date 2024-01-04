"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import error from "../players/error";

function NewChallengerModal({
  selectedTeams,
  leagueID,
  setShowChallengerModal,
}) {
  const queryClient = useQueryClient();
  const [errorlog, setErrorLog] = useState("");


  const [matchData, setData] = useState({
    team1_id: selectedTeams[0].team_id,
    team1_event_id: selectedTeams[0].event_id,
    team2_id: selectedTeams[1].team_id,
    team2_event_id: selectedTeams[1].event_id,
    isfinished: false,
    match_date: "",
    winner_id: "",
    winner_score: "",
    team1_bonus: "",
    team2_bonus: "",
  });

  const handleChange = (e) => {
    // const { name, value } = e.target;

    // setData((matchData) => ({
    //   ...matchData,
    //   [name]: value,
    // }));

    const { name, value, type, checked } = e.target;
    setData((matchData) => ({
      ...matchData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  //console.log(matchData);

  //INSERT NEW CHALLENGER MATCH //INVALIDATE queryKey: ["league-challengers", id],
  const { mutate: insertChallenger, isLoading } = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/leagues/${leagueID}/challengers`, {
        challenger: matchData,
      }),

    onSuccess: () => {
      setShowChallengerModal(false);
      queryClient.invalidateQueries(["league-challengers", leagueID]);
    },
    onError: (error) => {
      console.log(error);
      setErrorLog('An error has occurred. Try again')
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

  // Check if required fields are empty
  const requiredFields = ['winner_id', 'winner_score', 'team1_bonus', 'team2_bonus'];
  const emptyFields = requiredFields.filter(field => !matchData[field]);

  if (emptyFields.length > 0) {
    setErrorLog(`Please fill in all required fields: ${emptyFields.join(', ')}`);
    return; // Prevent form submission
  }

    insertChallenger(matchData);
  };

  return (
    <div className="match-report">
      <form onSubmit={handleSubmit}>
        <div className="all-inputs">
          <div className="grouped-inputs participants">
            {selectedTeams.map((team, index) => (
              <h6 className="input" key={index}>
                T{index + 1}: {team[`player1_firstname`]} &{" "}
                {team[`player2_firstname`]}
              </h6>
            ))}
          </div>

          <div className="grouped-inputs">
            <div className="input">
              <label htmlFor="matchDate">Date of the match:</label>
              <input
                id="matchDate"
                required
                type="date"
                name="match_date"
                value={
                  matchData.match_date === null ? "" : matchData.match_date
                }
                onChange={handleChange}
              />
            </div>

            <div className="input checkbox">
              <label htmlFor="isFinished">Match completed?</label>
              <input
                id="isFinished"
                type="checkbox"
                name="isfinished"
                checked={matchData.isfinished}
                onChange={handleChange}
              />
            </div>

            
              
                <div className="input">
                  <label htmlFor="winner">{matchData.isfinished ? 'Who won?': 'Who is winning?'}</label>
                  <select
                    id="winner"
                    name="winner_id"
                    value={
                      matchData.winner_id !== null ? matchData.winner_id : ""
                    }
                    onChange={handleChange}
                  >
                    <option value="">{matchData.isfinished ? 'Select the winner:': ''}</option>
                    {selectedTeams.map((team, index) => (
                      <option key={index} value={team.team_id}>
                        {team.player1_firstname} {team.player1_lastname} &amp;{" "}
                        {team.player2_firstname} {team.player2_lastname}
                      </option>
                    ))}
                  </select>
                </div>
              
           
          </div>
          <div className="grouped-inputs">
            <div className="input">
              <label htmlFor="finalscore">Winner score:</label>
              <input
                id="finalscore"
                maxLength={15}
                placeholder="ex: '7/5 2/6 6/1'"
                name="winner_score"
                value={
                  matchData.winner_score === 0
                    ? "missing"
                    : matchData.winner_score
                }
                onChange={handleChange}
              />
            </div>

            <div className="input">
              <label htmlFor="t1bonus">T1 bonus points:</label>
              <input
                id="t1bonus"
                maxLength={1}
                placeholder="ex: 0"
                name="team1_bonus"
                value={matchData.team1_bonus}
                onChange={handleChange}
              />
            </div>

            <div className="input">
              <label htmlFor="t2sets">T2 bonus points:</label>
              <input
                id="t2sets"
                maxLength={1}
                placeholder="ex: 2"
                name="team2_bonus"
                value={matchData.team2_bonus}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" aria-label="Update Match data">
          {isLoading ? "submiting... " : "Submit challenger match"}
        </button>
      </form>

      <p className="error">{errorlog}</p>
    </div>
  );
}

export default NewChallengerModal;
