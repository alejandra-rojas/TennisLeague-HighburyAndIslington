"use client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const LeagueCard = ({
  id,
  league_name,
  starting_date,
  midway_point,
  end_data,
  isfinished,
}) => {
  return (
    <li className="league-single-entry">
      <header className="league-info">
        <div>
          <div className="league-title">
            <h3>{league_name}</h3>
            {/* <button
              onClick={() => setShowModal(true)}
              aria-label="Show 'Edit League' Modal"
            >
              Edit league
            </button> */}
          </div>
          {/* <div className="league-dates">
            <p>
              {startDate.toDateString()} to {endDate.toDateString()}
            </p>
            <p>Midpoint: {midDate.toDateString()}</p>
          </div> */}
        </div>
        {/* <div className="league-stats">
          {!isFinished && (
            <p
              className={
                message ===
                "Once all the results are entered, set the league to finished via the edit league modal."
                  ? "text-highlight"
                  : "days-left"
              }
            >
              {league.end_date < formattedTodaysDate && (
                <ExclamationTriangleIcon width={40} />
              )}
              {daysLeft} {message}
            </p>
          )}
        </div> */}
      </header>
    </li>
  );
};

export default LeagueCard;
