"use client";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

function ParticipantList({ event, registeredTeams }) {
  const queryClient = useQueryClient();

  //REMOVE TEAM FROM EVENT PARTICIPANT LIST
  const { mutate: removeTeam, isLoading: deleteLoading } = useMutation({
    mutationFn: async (teamId) =>
      await axios.delete(`/api/events/${event}/teams/${teamId}`),

    onSuccess: () => {
      //toast.success(`League deleted succesfully`);
      queryClient.invalidateQueries(["event-participants", event]);
    },
    onError: (error) => {
      //toast.error("something went wrong");
      console.log(error);
    },
  });

  const handleRemoveTeam = (teamId) => {
    removeTeam(teamId);
  };
  return (
    <>
      <div className="list">
        <h5>Event Participants</h5>
        <ul>
          {registeredTeams.map((team, index) => (
            <li
              key={team.team_id}
              className={index % 2 === 0 ? "even-row" : "odd-row"}
            >
              <p>
                <span>{team.player1name}</span>
                <span> & {team.player2name}</span>
              </p>
              <button
                aria-label={`Remove team ${team.player1name} & ${team.player2name} from event`}
                onClick={() => handleRemoveTeam(team.team_id)}
                disabled={deleteLoading}
              >
                <span>Remove</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ParticipantList;
