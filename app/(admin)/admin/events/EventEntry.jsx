"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import EventModal from "./EventModal";

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

            <div id="event-details">
              {matchesData.length === 0 && (
                <section id="create-event-table">
                  <div className="participants">
                    {teamsData.length === 0 ? (
                      <p className="text-highlight">
                        There are no participants on this event yet. To add a
                        participant to an event, search for them using the
                        search field below.
                      </p>
                    ) : (
                      <></>
                      /* <div className="list">
                        <h5>Event Participants</h5>
                        <ul>
                          {eventTeams.map((team, index) => (
                            <li
                              key={team.team_id}
                              className={
                                index % 2 === 0 ? "even-row" : "odd-row"
                              }
                            >
                              <p>
                                <span>
                                  {team.player1_firstname}{" "}
                                  {team.player1_lastname}
                                </span>{" "}
                                <span>
                                  & {team.player2_firstname}{" "}
                                  {team.player2_lastname}
                                </span>
                              </p>
                              <button
                                aria-label={`Remove team ${team.player1_firstname} ${team.player1_lastname} & ${team.player2_firstname} ${team.player2_lastname} from event`}
                                onClick={() => removeTeam(team.team_id)}
                              >
                                <span>Remove</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div> */
                    )}

                    {/* {eventTeams.length >= 4 && (
                      <button
                        onClick={handleGenerateMatches}
                        aria-label={`Create matches table`}
                        className="create-table"
                      >
                        <SparklesIcon width={20} />
                        Create standings table
                      </button>
                    )} */}
                  </div>

                  {/* <section id="player-search">
                    <div className="search-input">
                      

                      <form onSubmit={onSubmitTeamsForm}>
                        <input
                          type="text"
                          id="searchInput"
                          name="name"
                          placeholder="Search by participant's name:"
                          value={searchString}
                          onChange={(e) => setSearchString(e.target.value)}
                        ></input>

                        <button
                          type="submit"
                          aria-label="Submit search"
                          disabled={!searchString}
                        >
                          <MagnifyingGlassIcon width={25} />
                          <span>search</span>
                        </button>
                        <div className="clear-search">
                          {searchPerformed && (
                            <button
                              onClick={clearSearchResults}
                              aria-label="Clear search results"
                            >
                              <XMarkIcon width={20} />
                            </button>
                          )}
                        </div>
                      </form>
                      {error && <p className="error">{error}</p>}
                    </div>
                    {searchPerformed && teams.length >= 1 && (
                      <div className="search-results">
                        <h5>Search results:</h5>
                        <ul>
                          {teams.map((team, index) => (
                            <li
                              key={team.team_id}
                              className={
                                index % 2 === 0 ? "even-row" : "odd-row"
                              }
                            >
                              <span>
                                {team.player1_firstname} {team.player1_lastname}
                              </span>
                              <span>&</span>
                              <span>
                                {team.player2_firstname} {team.player2_lastname}
                              </span>

                              <button
                                onClick={() => addTeam(team.team_id)}
                                aria-label={`Add team ${team.player1_firstname} ${team.player1_lastname} & ${team.player2_firstname} ${team.player2_lastname} to event`}
                              >
                                Add team to event
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {searchPerformed && teams.length === 0 && (
                      <p className="error">
                        No results! You can add a new participant to the
                        database via the players page
                      </p>
                    )}
                  </section> 
                */}
                </section>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default EventEntry;
