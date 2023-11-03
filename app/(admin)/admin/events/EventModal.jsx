"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";

function EventModal({
  mode,
  setShowEventModal,
  event_name,
  event_id,
  midway_matches,
  league_name,
  leagueID,
}) {
  const queryClient = useQueryClient();
  const editEvent = mode === "edit" ? true : false;

  const [data, setData] = useState({
    event_name: editEvent ? event_name : "",
    midway_matches: editEvent ? midway_matches : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  //CREATE EVENT
  const { mutate: submitEvent, isLoading } = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/leagues/${leagueID}/events`, { event: data }),

    onSuccess: () => {
      setShowEventModal(false);
      queryClient.invalidateQueries(["events", leagueID]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //UPDATE EVENT
  const { mutate: updateEvent, isLoading: isUpdating } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/events/${event_id}`, { event: data }),

    onSuccess: () => {
      setShowEventModal(false);
      queryClient.invalidateQueries(["events", leagueID]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //DELETE EVENT
  const { mutate: deleteEvent, isLoading: isDeleting } = useMutation({
    mutationFn: async () => await axios.delete(`/api/events/${event_id}`),

    onSuccess: () => {
      setShowEventModal(false);
      queryClient.invalidateQueries(["events", leagueID]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEvent) {
      updateEvent();
    } else {
      submitEvent();
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteEvent();
  };

  return (
    <section id="event-modal" className={mode === "edit" ? "edit" : "new"}>
      <div className="container">
        <div className="control">
          <h3>
            {mode === "edit"
              ? "Edit event details"
              : `Create event in league ${league_name}`}
          </h3>
          <button
            aria-label="Close new or edit event modal"
            onClick={() => {
              setShowEventModal(false);
            }}
          >
            <XMarkIcon width={25} />
            <span>close</span>
          </button>
        </div>
        <form>
          <fieldset>
            <legend className="sr-only">
              {mode === "edit" ? "Edit event" : "New event"}
            </legend>
            <div className="input">
              <label htmlFor="eventName">Event name:</label>
              <input
                id="eventName"
                required
                aria-required="true"
                maxLength={30}
                placeholder="Division A"
                name="event_name"
                value={data.event_name}
                onChange={handleChange}
              />
            </div>

            <div className="input">
              <label htmlFor="bonusMatches">
                Matches to play for midpoint bonus:
              </label>
              <input
                id="bonusMatches"
                required
                maxLength={1}
                placeholder="3"
                name="midway_matches"
                value={data.midway_matches}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              aria-label={editEvent ? "Edit event" : "Create new event"}
            >
              {!isLoading &&
                !isUpdating &&
                (editEvent ? "Edit event" : "Create event")}

              {isLoading && "Creating"}
              {isUpdating && "Editing"}
            </button>
          </fieldset>

          {mode === "edit" && (
            <button
              onClick={handleDelete}
              aria-label="Delete event from this league"
            >
              <TrashIcon width={20} />
              {isDeleting ? "Deleting" : "Delete event"}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}

export default EventModal;
