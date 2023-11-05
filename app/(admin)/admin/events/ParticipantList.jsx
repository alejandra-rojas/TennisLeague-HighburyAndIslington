import React from "react";

function ParticipantList() {
  return (
    <div className="list">
      <h5>Event Participants</h5>
      <ul>
        {eventTeams.map((team, index) => (
          <li
            key={team.team_id}
            className={index % 2 === 0 ? "even-row" : "odd-row"}
          >
            <p>
              <span>
                {team.player1_firstname} {team.player1_lastname}
              </span>{" "}
              <span>
                & {team.player2_firstname} {team.player2_lastname}
              </span>
            </p>
            <button
              aria-label={`Remove team ${team.player1_firstname} ${team.player1_lastname} & ${team.player2_firstname} ${team.player2_lastname} from event`}
              onClick={() => removeTeam(team.team_id)}
            >
              <span>Remove</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantList;
