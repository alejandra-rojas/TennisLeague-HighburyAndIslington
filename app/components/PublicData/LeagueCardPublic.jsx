"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import "../../styles/Public/LeagueCardPublic.scss";
import EventsPublic from "./EventsPublic";

const LeagueCardPublic = ({
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
    message = "Today is the last day to complete a match";
  } else {
    message = "The league has ended";
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

  return (
    <li className="league-single-entry">
      {!showModal && (
        <header className="league-info">
          <div>
            <div className="league-title">
              <h3>{league_name}</h3>
            </div>
            <div className="league-dates">
              <div>
                {starting_date} - {end_date}
              </div>

              <p>Halfway Point: {midDate.toDateString()}</p>
            </div>
          </div>
          {!isFinished && (
            <p className="days-left">
              {daysLeft} {message}
            </p>
          )}
        </header>
      )}

      <EventsPublic
        leagueID={id}
        league_name={league_name}
        midway_point={midway_point}
        hasStarted={hasStarted}
        challengerMatches={challengerMatches}
      />
    </li>
  );
};

export default LeagueCardPublic;
