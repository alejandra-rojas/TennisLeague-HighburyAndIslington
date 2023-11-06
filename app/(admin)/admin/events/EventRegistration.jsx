"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import ParticipantList from "./ParticipantList";
import PlayerSearch from "./PlayerSearch";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useStore } from "../../../store/createStore";

function EventRegistration({ event }) {
  // const { drawParticipants } = useStore();

  const queryClient = useQueryClient();
  //GET EVENT PARTICIPANT TEAMS DATA
  const {
    data: registeredTeams,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useQuery({
    queryKey: ["event-participants", event],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${event}/teams`);
      return data.data;
    },
  });

  //CREATE DRAW
  const { mutate: createDraw, isLoading } = useMutation({
    mutationFn: (data) => axios.post(`/api/matches`, { data }),

    onSuccess: () => {
      queryClient.invalidateQueries(["event-matches", event.event_id]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //GENERATE DRAW
  const handleGenerateDraw = () => {
    const matchCombinations = [];

    for (let i = 0; i < drawParticipants.length; i++) {
      for (let j = i + 1; j < drawParticipants.length; j++) {
        matchCombinations.push({
          event_id: event,
          team1_id: drawParticipants[i].team_id,
          team2_id: drawParticipants[j].team_id,
        });
      }
    }
    console.log(matchCombinations);
    createDraw({ matches: matchCombinations });
  };

  return (
    <div id="event-details">
      <section id="create-event-table">
        <div className="participants">
          {!registeredTeams ? (
            <p className="text-highlight">
              There are no participants on this event yet. To add a participant
              to an event, search for them using the search field below.
            </p>
          ) : (
            <ParticipantList registeredTeams={registeredTeams} event={event} />
          )}

          {registeredTeams && registeredTeams.length >= 4 && (
            <button
              onClick={handleGenerateDraw}
              aria-label={`Create matches table`}
              className="create-table"
            >
              <SparklesIcon width={20} />
              Create standings table
            </button>
          )}
        </div>

        <PlayerSearch registeredTeams={registeredTeams} event={event} />
      </section>
    </div>
  );
}

export default EventRegistration;
