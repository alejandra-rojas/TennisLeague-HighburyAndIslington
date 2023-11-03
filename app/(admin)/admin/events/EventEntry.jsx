"use client";
import { useState } from "react";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import EventModal from "./EventModal";

function EventEntry({ event, leagueID }) {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTeams, setShowTeams] = useState(false);

  return (
    <>
      <section id="event-entry">
        {!showEventModal && (
          <header>
            <div className="event-details">
              <h4>{event.event_name}</h4>
              <button
                onClick={() => setShowEventModal(true)}
                aria-label="Opel modal to edit this event"
              >
                Edit event
              </button>
            </div>
            <button
              onClick={() => setShowTeams((prevState) => !prevState)}
              aria-expanded={showTeams}
              aria-controls="eventDetailsSection"
              aria-label={showTeams ? "Collapse Teams" : "Expand Teams"}
            >
              {showTeams ? (
                <ArrowsPointingInIcon width={25} />
              ) : (
                <ArrowsPointingOutIcon width={25} />
              )}
            </button>
          </header>
        )}

        {showEventModal && (
          <EventModal
            mode={"edit"}
            leagueID={leagueID}
            {...event}
            setShowEventModal={setShowEventModal}
          />
        )}
      </section>
    </>
  );
}

export default EventEntry;
