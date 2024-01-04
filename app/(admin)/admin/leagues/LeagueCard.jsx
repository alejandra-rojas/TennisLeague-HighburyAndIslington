"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import LeagueModal from "./LeagueModal";
import Events from "../events/Events";
import ChallengerLeagueLevel from "../challengers/ChallengerLeagueLevel";

const LeagueCard = ({
  id,
  league_name,
  starting_date,
  midway_point,
  end_date,
  isfinished,
}) => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const isFinished = isfinished;
  const startDate = new Date(starting_date);
  const endDate = new Date(end_date);
  const midDate = new Date(midway_point);
  const today = new Date();
  const registrationCutoff = new Date(startDate);
  registrationCutoff.setDate(startDate.getDate() - 2); // Two days before the start
  let daysLeft;
  let message;
  const hasStarted = today >= startDate;

  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const formattedTodaysDate = formatDateToYYYYMMDD(today);

  if (today < registrationCutoff) {
    // Calculate days left to join
    const daysToJoin = Math.ceil(
      (registrationCutoff - today) / (1000 * 3600 * 24)
    );

    daysLeft = daysToJoin;
    message =
      daysLeft === 1
        ? "day left to join the league"
        : "days left to join the league";
  } else if (today >= startDate && today < endDate) {
    // Calculate days left of play
    const daysOfPlay = Math.ceil((endDate - today) / (1000 * 3600 * 24));
    daysLeft = daysOfPlay;

    message = daysLeft === 1 ? "day left of play" : "days left of play";
  } else if (end_date === formattedTodaysDate) {
    // Last day to play
    message = "Today is the last day to complete a match";
  } else {
    // No days left, either league hasn't started or has already ended
    message =
      "Once all the results are entered, set the league to finished via the edit league modal.";
  }

  //GET ALL TEAMS PARTICIPATING IN THIS LEAGUE
  /*   console.log("Participant team objects:", registeredTeams);

  const teamIds = registeredTeams
    ? registeredTeams.map((team) => team.team_id)
    : [];
  console.log("Participant team ids:", teamIds); */

  const {
    data: leagueParticipants,
    isLoading: loadingParticipants,
    isError: participantsError,
  } = useQuery({
    queryKey: ["league-participantTeams", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/leagues/${id}/teams`);
      return data.data;
    },
  });

  //console.log(leagueParticipants);

  //GET ALL CHALLENGER MATCHES FOR THIS LEAGUE
  const {
    data: challengerMatches,
    isLoading: loadingChallengers,
    isError: challengersError,
  } = useQuery({
    queryKey: ["league-challengers", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/leagues/${id}/challengers`);
      return data.data;
    },
  });

  //console.log(challengerMatches);

  return (
    <li className="league-single-entry">
      {!showModal && (
        <header className="league-info">
          <div>
            <div className="league-title">
              <h3>{league_name}</h3>
              <button
                onClick={() => setShowModal(true)}
                aria-label="Show 'Edit League' Modal"
              >
                Edit league
              </button>
            </div>
            <div className="league-dates">
              <p>
                {startDate.toDateString()} to {endDate.toDateString()}
              </p>
              <p>Midpoint: {midDate.toDateString()}</p>
            </div>
          </div>
          <div className="league-stats">
            {/*           <p>
            {leagueEvents.length}{" "}
            {leagueEvents.length === 1 ? "event" : "events"}
          </p> */}

            {!isFinished && (
              <p
                className={
                  message ===
                  "Once all the results are entered, set the league to finished via the edit league modal."
                    ? "text-highlight"
                    : "days-left"
                }
              >
                {end_date < formattedTodaysDate && (
                  <ExclamationTriangleIcon width={40} />
                )}
                {daysLeft} {message}
              </p>
            )}
          </div>
        </header>
      )}
      {showModal && (
        <LeagueModal
          mode={"edit"}
          setShowModal={setShowModal}
          today={today}
          id={id}
          league_name={league_name}
          starting_date={starting_date}
          midway_point={midway_point}
          end_date={end_date}
          isfinished={isfinished}
        />
      )}
      <Events
        leagueID={id}
        league_name={league_name}
        midway_point={midway_point}
        hasStarted={hasStarted}
        challengerMatches={challengerMatches}
      />

      {loadingParticipants ? (
        "Loading challengers data..."
      ) : (
        <ChallengerLeagueLevel
          hasStarted={hasStarted}
          leagueID={id}
          leagueParticipants={leagueParticipants}
        />
      )}
    </li>
  );
};

export default LeagueCard;
