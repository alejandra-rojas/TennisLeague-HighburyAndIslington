"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import EventModal from "./EventModal";
import EventRegistration from "./registration/EventRegistration";
import StandingsTable from "./draw/StandingsTable";

function EventEntry({ event, leagueID, challengerMatches, midway_point }) {
  
  const queryClient = useQueryClient();
  const [showEventModal, setShowEventModal] = useState(false);
  const [expandEvent, setExpandEvent] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  //GET EVENT PARTICIPANT TEAMS DATA
  const {
    data: registeredTeams,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useQuery({
    queryKey: ["event-participants", event.event_id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${event.event_id}/teams`);
      return data.data;
    },
  });

  //GET EVENT MATCHES DATA - FOR STADISTICS TABLE
  const {
    data: matchesData,
    isLoading: matchesLoading,
    isError: matchesError,
  } = useQuery({
    queryKey: ["event-draw", event.event_id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${event.event_id}/matches`);
      //console.log(data);
      return data.data;
    },
  });

  if (matchesLoading) {
    return <div>Loading...</div>;
  }

  if (matchesError) {
    return <div>There was an error, try again.</div>;
  }

  return (
    <>
      <section id="event-entry">
        {!showEventModal && (
          <header>
            <div className="event-details">
              <h4>{event.event_name}</h4>
              <button
                onClick={() => setShowEventModal(true)}
                aria-label="Open modal to edit this event"
              >
                Edit event
              </button>
            </div>
            <button
              onClick={() => setExpandEvent((prevState) => !prevState)}
              aria-expanded={expandEvent}
              aria-controls="eventDetailsSection"
              aria-label={expandEvent ? "Collapse Teams" : "Expand Teams"}
            >
              {expandEvent ? (
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

        {expandEvent && (
          <>
            {matchesData.length !== 0 && (
              <div className="event-info">
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <InformationCircleIcon width={25} />
                  {showTooltip && (
                    <div className="tooltip">
                      Once the standings table for an event has been published,
                      the participating teams cannot be altered anymore, unless
                      the team is withdrawing from the event.
                    </div>
                  )}
                </div>
                <p>
                  {event.midway_matches} matches to be completed before the
                  midpoint to get bonus points
                </p>
              </div>
            )}
            <div className="line"></div>

            <div id="event-details">
              {matchesData.length === 0 && (
                <EventRegistration
                  event={event.event_id}
                  registeredTeams={registeredTeams}
                />
              )}
              {matchesData.length !== 0 && (
                <StandingsTable
                  matchesData={matchesData}
                  registeredTeams={registeredTeams}
                  challengerMatches={challengerMatches}
                  midway_point={midway_point}
                />
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default EventEntry;
