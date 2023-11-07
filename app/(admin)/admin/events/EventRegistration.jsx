"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import ParticipantList from "./ParticipantList";
import PlayerSearch from "./PlayerSearch";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useStore } from "../../../store/createStore";

function EventRegistration({ event, registeredTeams }) {
  // const { drawParticipants } = useStore();
  const queryClient = useQueryClient();

  //CREATE DRAW
  const { mutate: createDraw, isLoading } = useMutation({
    mutationFn: (matches) => axios.post(`/api/matches`, matches),

    onSuccess: () => {
      queryClient.invalidateQueries(["event-draw", event]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //GENERATE DRAW
  const handleGenerateDraw = () => {
    const matchCombinations = [];

    for (let i = 0; i < registeredTeams.length; i++) {
      for (let j = i + 1; j < registeredTeams.length; j++) {
        matchCombinations.push({
          event_id: event,
          team1_id: registeredTeams[i].team_id,
          team2_id: registeredTeams[j].team_id,
        });
      }
    }
    console.log(matchCombinations);
    createDraw({ matches: matchCombinations });
  };

  return (
    <section id="create-event-table">
      <div className="participants">
        {registeredTeams.length === 0 ? (
          <p className="text-highlight">
            There are no participants on this event yet. To add a participant to
            an event, search for them using the search field below.
          </p>
        ) : (
          <ParticipantList registeredTeams={registeredTeams} event={event} />
        )}

        {registeredTeams.length >= 4 && (
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
  );
}

export default EventRegistration;
