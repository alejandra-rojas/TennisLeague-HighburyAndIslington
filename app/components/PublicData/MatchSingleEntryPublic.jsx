import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

function MatchSingleEntryPublic({ index, match, midway_point }) {
  //console.log(match.match_date);
  //console.log(midway_point);

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
        <div>vs</div>
        <div className={match.winner_id === match.team2_id ? "font-bold" : ""}>
          {match.team2.player1.firstname} & {match.team2.player2.firstname}
        </div>

        {/* <div>{match.team1_sets === 0 ? "-" : match.team1_sets}</div>
    <div>{match.team2_sets === 0 ? "-" : match.team2_sets}</div> */}
        <div>{match.winner_score.trim() === "1" ? "" : match.winner_score}</div>
        <div>
          {match.isfinished ? <CheckIcon width={20} /> : ""}
          {!match.isfinished && match.match_date && "U"}
        </div>

        <div>
          {match.match_date === null
            ? ""
            : match.match_date <= midway_point
            ? `*`
            : ""}
        </div>
      </li>
    </>
  );
}

export default MatchSingleEntryPublic;
