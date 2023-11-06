"use client";
import React from "react";
import ParticipantList from "./ParticipantList";
import PlayerSearch from "./PlayerSearch";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useStore } from "../../../store/createStore";

function EventRegistration({ matchesData, teamsData }) {
  const { drawParticipants } = useStore();

  return (
    <div id="event-details">
      {matchesData.length === 0 && (
        <section id="create-event-table">
          <div className="participants">
            {drawParticipants.length === 0 ? (
              <p className="text-highlight">
                There are no participants on this event yet. To add a
                participant to an event, search for them using the search field
                below.
              </p>
            ) : (
              <ParticipantList />
            )}

            {drawParticipants.length >= 4 && (
              <button
                //onClick={handleGenerateMatches}
                aria-label={`Create matches table`}
                className="create-table"
              >
                <SparklesIcon width={20} />
                Create standings table
              </button>
            )}
          </div>

          <PlayerSearch />
        </section>
      )}
    </div>
  );
}

export default EventRegistration;
