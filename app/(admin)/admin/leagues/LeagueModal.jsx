"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "react-query";

function LeagueModal({ mode, setShowModal, getData, today }) {
  const queryClient = useQueryClient();
  const { mutate: submitLeague, isLoading } = useMutation({
    mutationFn: async () => await axios.post("/api/leagues", { league: data }),

    onSuccess: () => {
      //toast.success(`League created succesfully`);
      setShowModal(false);
      queryClient.invalidateQueries(["leagues"]);
    },
    onError: (error) => {
      //toast.error("something went wrong");
      console.log(error);
    },
  });

  const editMode = mode === "edit" ? true : false;
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    league_name: editMode ? league.league_name : "",
    starting_date: editMode ? league.starting_date : "",
    midway_point: editMode ? league.midway_point : "",
    end_date: editMode ? league.end_date : "",
    isfinished: editMode ? league.isfinished : "",
  });

  const handleChange = (e) => {
    //console.log("changing", e);
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setData((data) => ({
      ...data,
      [name]: newValue,
    }));
    //console.log(data);

    if (
      name === "midway_point" &&
      (new Date(value) <= new Date(data.starting_date) ||
        new Date(value) >= new Date(data.end_date))
    ) {
      setError(
        "Midpoint date must be after the start date and before the end date."
      );
    } else if (
      name === "end_date" &&
      new Date(value) <= new Date(data.midway_point)
    ) {
      setError("End date must be after the mid date.");
    } else {
      setError("");
    }
  };

  /* const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/leagues`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 200) {
        //console.log("Created new league succesfully!");
        setShowModal(false);
        getData();
        toast.success(`${data.league_name} league created `);
      }
    } catch (error) {
      console.error(error);
    }
  }; */

  /*  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/leagues/${league.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 200) {
        //console.log("edited");
        setShowModal(false);
        getData();
        toast.success(`${data.league_name} has been modified succesfully`);
      }
    } catch (error) {
      console.error(error);
    }
  }; */

  /* const deleteLeague = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/leagues/${league.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        toast.success(`League has been deleted`);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }; */

  return (
    <section id="league-modal">
      <div className="edit-container">
        <div className="control">
          <h3>
            {mode === "edit"
              ? `Edit ${data.league_name} league `
              : `Create a new league`}
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
            }}
            aria-label="Close Modal"
          >
            <XMarkIcon width={25} />
            <span>close</span>
          </button>
        </div>
        <form>
          <legend className="sr-only">
            {mode === "edit" ? "Edit League" : "Create League"}
          </legend>

          {!(mode === "edit" && today >= new Date(league.end_date)) && (
            <>
              <div className="input">
                <label htmlFor="leagueName">League name:</label>
                <input
                  id="leagueName"
                  required
                  aria-required="true"
                  maxLength={30}
                  placeholder="Women Doubles"
                  name="league_name"
                  value={data.league_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="input">
                <label htmlFor="startDate">Start date:</label>
                <input
                  id="startDate"
                  required
                  aria-required="true"
                  type="date"
                  name="starting_date"
                  value={data.starting_date}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="input">
                <label htmlFor="midPoint">Midway point:</label>
                <input
                  id="midPoint"
                  name="midway_point"
                  required
                  type="date"
                  value={data.midway_point}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="input">
                <label htmlFor="endDate">End date:</label>
                <input
                  id="endDate"
                  name="end_date"
                  required
                  aria-required="true"
                  type="date"
                  value={data.end_date}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {mode === "edit" && today >= new Date(league.end_date) && (
            <div className="checkbox">
              <label htmlFor="isFinished" id="isFinishedDescription">
                Check the box if all the results have been entered
              </label>
              <input
                id="isFinished"
                type="checkbox"
                name="isfinished"
                checked={data.isfinished}
                onChange={handleChange}
                aria-describedby="isFinishedDescription"
              />
            </div>
          )}

          {!error && (
            <button
              type="submit"
              //   onClick={editMode ? editData : postData}
              onClick={() => submitLeague()}
              aria-label={editMode ? "Edit League" : "Create new league"}
              disabled={isLoading}
            >
              {/* {editMode ? "Edit league" : "Create league"}  */}
              {!isLoading && (editMode ? "Edit league" : "Create league")}
              {isLoading && (editMode ? "Editing" : "Creating")}
            </button>
          )}
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>
      {/* 
      {mode === "edit" && today <= new Date(league.end_date) && (
        <button
          onClick={() => deleteLeague()}
          aria-label="Delete League from databse"
          className="delete"
        >
          <TrashIcon width={20} />
          <span>Delete league</span>
        </button>
      )} */}
    </section>
  );
}

export default LeagueModal;
