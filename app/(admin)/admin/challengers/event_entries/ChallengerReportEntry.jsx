import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ChallengerEditModal from "./ChallengerEditModal";

function ChallengerReportEntry({ index, match }) {
  const [showReportModal, setShowReportModal] = useState(false);
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

        <div>{match.winner_score.trim() === "1" ? "" : match.winner_score}</div>

        <div>{match.team1_bonus}</div>
        <div>{match.team2_bonus}</div>
        <button
          onClick={() => setShowReportModal(true)}
          aria-label="Edit Match Details"
          disabled={match.withdrawal}
        >
          edit match
        </button>
      </li>

      {showReportModal && (
        <ChallengerEditModal
          match={match}
          setShowReportModal={setShowReportModal}
          // getChallengersData={getChallengersData}
          // getEventTeamsData={getEventTeamsData}
          // getEventMatchesData={getEventMatchesData}
        />
      )}
    </>
  );
}

export default ChallengerReportEntry;
