"use client";
import "../../../styles/Admin/EventEntry.scss";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import EventEntry from "./EventEntry";
import EventModal from "./EventModal";

function Events({
  leagueID,
  hasStarted,
  league_name,
  challengerMatches,
  midway_point,
}) {
  const [showEventModal, setShowEventModal] = useState(false);
  const lowercaseTitle = league_name.toLowerCase();

  //GET EVENTS DATA
  const { data, isLoading, isError } = useQuery({
    queryKey: ["events", leagueID],
    queryFn: async () => {
      const { data } = await axios.get(`/api/leagues/${leagueID}/events`);
      //console.log(data);

      return data.data.sort((a, b) => a.event_name.localeCompare(b.event_name));
    },
  });

  if (isLoading) return <div>Loading league events...</div>;
  if (isError) return <div>There was an error, try again. </div>;

  return (
    <>
      {/* <div>{JSON.stringify(data, null, 2)}</div> */}
      <section id="events-section">
        {data && (
          <div className="event-container">
            <ul>
              {data.map((event) => (
                <li key={event.event_id}>
                  <EventEntry
                    leagueID={leagueID}
                    event={event}
                    challengerMatches={challengerMatches}
                    midway_point={midway_point}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        {showEventModal && (
          <EventModal
            mode={"new"}
            league_name={league_name}
            setShowEventModal={setShowEventModal}
            leagueID={leagueID}
          />
        )}

        <button
          onClick={() => setShowEventModal(true)}
          aria-label="Opel Modal to add an event to this league"
          className={hasStarted ? "ongoing" : ""}
        >
          <PlusCircleIcon width={30} />
          Add event to {lowercaseTitle}
        </button>
      </section>
    </>
  );
}

export default Events;
