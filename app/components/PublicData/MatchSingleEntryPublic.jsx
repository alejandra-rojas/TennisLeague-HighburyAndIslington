"use client";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

function MatchSingleEntryPublic({ index, match, midway_point }) {
  const [showMatchReportModal, setShowMatchReportModal] = useState(false);

  return (
    <>
      <li
        className={`${match.withdrawal ? "withdrawn" : ""} ${
          !match.withdrawal ? (index % 2 === 0 ? "even-row" : "odd-row") : ""
        }`}
      >
        <div className={match.winner_id === match.team1_id ? "font-bold" : ""}>
          {match.team1.player1.firstname} & {match.team1.player2.firstname}
        </div>
        <div className={match.winner_id === match.team2_id ? "font-bold" : ""}>
          {match.team2.player1.firstname} & {match.team2.player2.firstname}
        </div>

        <div>{match.match_date === null ? "" : match.match_date}</div>
        <div>
          {match.isfinished ? <CheckIcon width={20} /> : ""}
          {!match.isfinished && match.match_date && <XMarkIcon width={20} />}
        </div>

        {/* <div>{match.team1_sets === 0 ? "-" : match.team1_sets}</div>
    <div>{match.team2_sets === 0 ? "-" : match.team2_sets}</div> */}
        <div>{match.winner_score.trim() === "1" ? "" : match.winner_score}</div>
        {/* <button
          onClick={() => setShowMatchReportModal(true)}
          aria-label="Edit Match Details"
          disabled={match.withdrawal}
        >
          match report
        </button> */}
      </li>
    </>
  );
}

export default MatchSingleEntryPublic;
