import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

function MatchReportModal({ match, setShowMatchReportModal, midway_point }) {
  //console.log(midway_point)
  const queryClient = useQueryClient();

  const [data, setData] = useState({
    match_date: match.match_date,
    byMidpoint: match.bymidpoint,
    isfinished: match.isfinished,
    winner_id: match.winner_id,
    team1_sets: match.team1_sets,
    team2_sets: match.team2_sets,
    winner_score: match.winner_score,
  });
  //console.log(data)

  const handleChange = (e) => {
    //console.log("changing", e);
    const { name, value, type, checked } = e.target;

    // Check if the changed field is 'match_date'
  if (name === 'match_date') {
    // Compare the entered date with the midway_point
    const enteredDate = new Date(value);
    const midwayDate = new Date(midway_point);

    // Update the byMidpoint variable based on the comparison
    const byMidpoint = enteredDate <= midwayDate;

    setData((prevData) => ({
      ...prevData,
      match_date: value,
      byMidpoint: byMidpoint,
      [name]: type === 'checkbox' ? checked : value,
    }));
    //console.log(byMidpoint)
  } else {
    // For other fields, update as usual
    setData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }
  };
  


  //UPDATE EVENT
  const { mutate: reportMatch, isLoading: isUpdating } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/matches/${match.match_id}`, { match: data }),

    onSuccess: () => {
      setShowMatchReportModal(false);
      queryClient.invalidateQueries(["event-draw", match.event_id]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const submitReport = (e) => {
    e.preventDefault();
    reportMatch();
  };

  //UPDATE DATA
  /*       const updateMatchData = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVERURL}/matches/${match.match_id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          if (response.status === 200) {
            console.log("Event was edited!");
            setShowMatchReportModal(false);
            getEventMatchesData();
            getEventTeamsData();
          }
        } catch (error) {
          console.error(error);
        }
      }; */

  return (
    <section id="report-modal">
      <header className="control">
        <h5>Match report</h5>

        <button
          onClick={() => {
            setShowMatchReportModal(false);
          }}
        >
          <XMarkIcon width={25} />
          <span>close</span>
        </button>
      </header>

      <div className="players">
        <h6>
          T1: {match.team1.player1.firstname} {match.team1.player1.lastname} &{" "}
          {match.team1.player2.firstname} {match.team1.player2.lastname}
        </h6>
        <h6>
          T2: {match.team2.player1.firstname} {match.team2.player1.lastname} &{" "}
          {match.team2.player2.firstname} {match.team2.player2.lastname}
        </h6>
      </div>

      <form>
        <div className="grouped-inputs">
          <div className="input">
            <label htmlFor="matchDate">Date of the match:</label>
            <input
              id="matchDate"
              required
              type="date"
              name="match_date"
              value={data.match_date === null ? "" : data.match_date}
              onChange={handleChange}
            />
          </div>

          <div className="input checkbox">
            <label htmlFor="isFinished">Match completed?</label>
            <input
              id="isFinished"
              type="checkbox"
              name="isfinished"
              checked={data.isfinished}
              onChange={handleChange}
            />
          </div>

          {data.isfinished && (
            <>
              <div className="input">
                <label htmlFor="winner">Who won:</label>
                <select
                  id="winner"
                  name="winner_id"
                  value={data.winner_id !== null ? data.winner_id : ""}
                  onChange={handleChange}
                >
                  <option value="">Select a winner</option>
                  <option value={match.team1_id}>
                    {match.team1.player1.firstname}{" "}
                    {match.team1.player1.lastname} &{" "}
                    {match.team1.player2.firstname}{" "}
                    {match.team1.player2.lastname}
                  </option>
                  <option value={match.team2_id}>
                    {match.team2.player1.firstname}{" "}
                    {match.team2.player1.lastname} &{" "}
                    {match.team2.player2.firstname}{" "}
                    {match.team2.player2.lastname}
                  </option>
                </select>
              </div>
            </>
          )}
        </div>
        <div className="grouped-inputs">
          <div className="input">
            <label htmlFor="finalscore">Winner score:</label>
            <input
              id="finalscore"
              maxLength={15}
              placeholder="ex: '7/5 2/6 6/1"
              name="winner_score"
              value={data.winner_score === 0 ? "missing" : data.winner_score}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            <label htmlFor="t1sets">Sets won by {match.team1.player1.firstname} & {match.team1.player2.firstname}:</label>
            <input
              id="t1sets"
              maxLength={1}
              placeholder="ex: 0"
              name="team1_sets"
              value={data.team1_sets}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            <label htmlFor="t2sets">Sets won by {match.team2.player1.firstname} & {match.team2.player2.firstname}:</label>
            <input
              id="t2sets"
              maxLength={1}
              placeholder="ex: 2"
              name="team2_sets"
              value={data.team2_sets}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          onClick={submitReport}
          aria-label="Update Match data"
        >
          {isUpdating ? "submitting" : "Submit match report"}
        </button>
      </form>
    </section>
  );
}

export default MatchReportModal;
