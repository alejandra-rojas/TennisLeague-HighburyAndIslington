"use client";
import { useStore } from "../../../store/createStore";
import React, { useEffect } from "react";

function ParticipantList() {
  const { drawParticipants, lastAction, removeTeam, resetLastAction } =
    useStore();

  const handleRemoveTeam = (teamId) => {
    removeTeam(teamId);
  };

  useEffect(() => {
    let timeoutId;

    if (lastAction === "duplicate") {
      timeoutId = setTimeout(() => {
        resetLastAction();
      }, 5000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastAction, resetLastAction]);
  return (
    <>
      <div className="list">
        <h5>Event Participants</h5>
        <ul>
          {drawParticipants.map((team, index) => (
            <li
              key={team.team_id}
              className={index % 2 === 0 ? "even-row" : "odd-row"}
            >
              <p>
                <span>
                  {team.player1name} {team.player1lastname}
                </span>
                <span>
                  & {team.player2name} {team.player2lastname}
                </span>
              </p>
              <button
                aria-label={`Remove team ${team.player1name} ${team.player1lastname} & ${team.player2name} ${team.player2lastname} from event`}
                onClick={() => handleRemoveTeam(team.team_id)}
              >
                <span>Remove</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {lastAction === "duplicate" && (
        <p className="error">The selected team has already been added.</p>
      )}
    </>
  );
}

export default ParticipantList;
