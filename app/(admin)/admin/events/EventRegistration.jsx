import React from "react";
import ParticipantList from "./ParticipantList";
import PlayerSearch from "./PlayerSearch";
import { SparklesIcon } from "@heroicons/react/24/solid";

function EventRegistration({ matchesData, teamsData }) {
  return (
    <div id="event-details">
      {matchesData.length === 0 && (
        <section id="create-event-table">
          <div className="participants">
            {teamsData.length === 0 ? (
              <p className="text-highlight">
                There are no participants on this event yet. To add a
                participant to an event, search for them using the search field
                below.
              </p>
            ) : (
              <ParticipantList />
            )}

            {teamsData.length >= 4 && (
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
