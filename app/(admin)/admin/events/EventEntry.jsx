"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import EventModal from "./EventModal";
import PlayerSearch from "./PlayerSearch";
import ParticipantList from "./ParticipantList";
import EventRegistration from "./EventRegistration";

function EventEntry({ event, leagueID }) {
  const queryClient = useQueryClient();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [eventTeams, setEventTeams] = useState(null);
  const [eventMatchesData, setEventMatchesData] = useState(null);

  //GET EVENT TEAMS DATA
  const {
    data: teamsData,
    isLoading: teamsLoading,
    isError: teamsError,
  } = useQuery({
    queryKey: ["event-teams", event.event_id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${event.event_id}/teams`);
      console.log(data);
      return data.data;
    },
  });

  //GET EVENT MATCHES DATA - FOR STADISTICS TABLE
  const {
    data: matchesData,
    isLoading: matchesLoading,
    isError: matchesError,
  } = useQuery({
    queryKey: ["event-matches", event.event_id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/events/${event.event_id}/matches`);
      console.log(data);
      return data.data;
    },
  });

  if (teamsLoading || matchesLoading) {
    return <div>Loading...</div>;
  }

  if (teamsError || matchesError) {
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

        {showTeams && (
          <>
            {/* <div>
              {eventMatchesData.length !== 0 && (
                <div className="event-info">
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <InformationCircleIcon width={25} />
                    {showTooltip && (
                      <div className="tooltip">
                        Once the standings table for an event has been
                        published, the participating teams cannot be altered
                        anymore, unless the team is withdrawing from the event.
                      </div>
                    )}
                  </div>
                  <p>
                    Complete {gevent.midway_matches} matches before the midpoint
                    to get bonus points
                  </p>
                </div>
              )}
              <div className="line"></div>
            </div> */}

            <EventRegistration
              matchesData={matchesData}
              teamsData={teamsData}
            />
          </>
        )}
      </section>
    </>
  );
}

export default EventEntry;
