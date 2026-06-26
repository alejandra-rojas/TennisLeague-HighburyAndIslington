"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function NewChallengerModal({
  selectedTeams,
  leagueID,
  setShowChallengerModal,
}) {
  const queryClient = useQueryClient();
  const [errorlog, setErrorLog] = useState("");
  const numericFields = ["team1_bonus", "team2_bonus", "winner_id"];

  const [matchData, setMatchData] = useState({
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

  const isMatchFinished = matchData.isfinished;
  const validationError =
    isMatchFinished && !matchData.winner_id ? "Please select the winner." : "";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errorlog) {
      setErrorLog("");
    }

    setMatchData((matchData) => ({
      ...matchData,
      [name]:
        type === "checkbox"
          ? checked
          : numericFields.includes(name)
          ? value === ""
            ? ""
            : parseInt(value, 10)
          : value,
    }));
  };

  const { mutate: insertChallenger, isPending: isLoading } = useMutation({
    mutationFn: async (challenger) =>
      await axios.post(`/api/leagues/${leagueID}/challengers`, challenger),

    onSuccess: () => {
      setShowChallengerModal(false);
      queryClient.invalidateQueries({
        queryKey: ["league-challengers", leagueID],
      });
    },
    onError: (error) => {
      console.log(error);
      const apiError = error.response?.data?.error;
      setErrorLog(
        typeof apiError === "string"
          ? apiError
          : apiError?.message || "An error has occurred. Try again"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validationError) {
      setErrorLog(validationError);
      return;
    }

    // Check if required fields are empty
    const requiredFields = [
      "match_date",
      "team1_bonus",
      "team2_bonus",
      "winner_score",
    ];
    if (isMatchFinished) {
      requiredFields.push("winner_id");
    }
    const emptyFields = requiredFields.filter(
      (field) =>
        matchData[field] === "" ||
        matchData[field] === null ||
        matchData[field] === undefined
    );
    if (emptyFields.length > 0) {
      setErrorLog(
        `Please fill in all required fields: ${emptyFields.join(", ")}`
      );
      return; // Prevent form submission
    }

    const payload = {
      ...matchData,
      winner_id: matchData.winner_id === "" ? null : matchData.winner_id,
    };

    insertChallenger(payload);
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
              <label htmlFor="winner">
                {matchData.isfinished ? "Who won?" : "Who is winning?"}
              </label>
              <select
                id="winner"
                name="winner_id"
                value={matchData.winner_id !== "" ? matchData.winner_id : ""}
                onChange={handleChange}
              >
                <option value="">
                  {matchData.isfinished ? "Select the winner:" : ""}
                </option>
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
          {isLoading ? "Submitting challenger..." : "Submit challenger match"}
        </button>
      </form>

      <p className="error">{errorlog || validationError}</p>
    </div>
  );
}

export default NewChallengerModal;
