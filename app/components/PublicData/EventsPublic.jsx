"use client";
import "../../styles/Admin/EventEntry.scss";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import EventEntryPublic from "./EventEntryPublic";

function EventsPublic({
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

      return data.data;
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
                  <EventEntryPublic
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
      </section>
    </>
  );
}

export default EventsPublic;
