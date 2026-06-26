import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ChallengerEditModal({ match, setShowReportModal }) {
  const queryClient = useQueryClient();
  const numericFields = ["team1_bonus", "team2_bonus", "winner_id"];
  const toOptionalNumber = (value) =>
    value === null || value === undefined || value === ""
      ? ""
      : parseInt(value, 10);

  const [data, setData] = useState({
    team1_id: match.team1_id,
    team2_id: match.team2_id,
    isfinished: Boolean(match.isfinished),
    match_date: match.match_date,
    winner_id: match.winner_id,
    winner_score: match.winner_score,
    team1_bonus: toOptionalNumber(match.team1_bonus),
    team2_bonus: toOptionalNumber(match.team2_bonus),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setData((prevData) => ({
      ...prevData,
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

  const { mutate: updateChallenger, isLoading: isUpdating } = useMutation({
    mutationFn: async (challenger) =>
      await axios.put(`/api/challengers/${match.match_id}`, challenger),

    onSuccess: () => {
      setShowReportModal(false);
      queryClient.invalidateQueries(["league-challengers", match.league_id]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    updateChallenger({
      ...data,
      winner_id: data.winner_id === "" ? null : data.winner_id,
    });
  };

  return (
    <section id="edit-challenger-modal">
      <div className="new-challenge">
        <div className="header">
          <h5>Edit challenger match</h5>
          <button
            onClick={() => setShowReportModal(false)}
            aria-label="Close the edit challenger modal"
          >
            <XMarkIcon width={25} />
            <span>close</span>
          </button>
        </div>

        <div className="match-report">
          <form>
            <div className="all-inputs">
              <div className="grouped-inputs">
                <div className="players">
                  <h6>
                    T1: {match.team1.player1.firstname} &{" "}
                    {match.team1.player2.firstname}
                  </h6>
                  <h6>
                    T2: {match.team2.player1.firstname} &{" "}
                    {match.team2.player2.firstname}
                  </h6>
                </div>
              </div>

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

                {/* {data.isfinished && (
                  <>
                    <div className="input">
                      <label htmlFor="winner">Who won:</label>

                      <select
                        id="winner"
                        name="winner_id"
                        value={data.winner_id !== null ? data.winner_id : ""}
                        onChange={handleChange}
                      >
                        <option value="">Select the match winner</option>
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
                )} */}

                <div className="input">
                  <label htmlFor="winner">
                    {data.isfinished ? "Who won?" : "Who is winning?"}
                  </label>
                  <select
                    id="winner"
                    name="winner_id"
                    value={data.winner_id !== null ? data.winner_id : ""}
                    onChange={handleChange}
                  >
                    <option value="">
                      {data.isfinished ? "Select the winner:" : ""}
                    </option>
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
              </div>
              <div className="grouped-inputs">
                <div className="input">
                  <label htmlFor="finalscore">Winner score:</label>
                  <input
                    id="finalscore"
                    maxLength={15}
                    placeholder="ex: '7/5 2/6 6/1"
                    name="winner_score"
                    value={data.winner_score || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="input">
                  <label htmlFor="t1bonus">
                    {match.team1.player1.firstname} &{" "}
                    {match.team1.player2.firstname} bonus:
                  </label>
                  <input
                    id="t1bonus"
                    type="number"
                    placeholder="ex: 0"
                    name="team1_bonus"
                    value={data.team1_bonus}
                    onChange={handleChange}
                  />
                </div>

                <div className="input">
                  <label htmlFor="t2sets">
                    {match.team2.player1.firstname} &{" "}
                    {match.team2.player2.firstname} bonus :
                  </label>
                  <input
                    id="t2sets"
                    type="number"
                    placeholder="ex: 2"
                    name="team2_bonus"
                    value={data.team2_bonus}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              aria-label="Update Match data"
              disabled={isUpdating}
            >
              {isUpdating ? "Editing challenger..." : "Edit challenger"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ChallengerEditModal;
