"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "react-query";

function LeagueModal({
  mode,
  setShowModal,
  today,
  id,
  league_name,
  starting_date,
  midway_point,
  end_date,
  isfinished,
}) {
  const queryClient = useQueryClient();
  //CREATE LEAGUE
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

  //UPDATE LEAGUE
  const { mutate: updateLeague, isLoading: updateLoading } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/leagues/${id}`, { league: data }),

    onSuccess: () => {
      //toast.success(`League deleted succesfully`);
      setShowModal(false);
      queryClient.invalidateQueries(["leagues"]);
    },
    onError: (error) => {
      //toast.error("something went wrong");
      console.log(error);
    },
  });

  //DELETE LEAGUE
  const { mutate: deleteLeague, isLoading: deleteLoading } = useMutation({
    mutationFn: async () => await axios.delete(`/api/leagues/${id}`),

    onSuccess: () => {
      //toast.success(`League deleted succesfully`);
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
  const [isFormValid, setIsFormValid] = useState(false);

  const [data, setData] = useState({
    league_name: editMode ? league_name : "",
    starting_date: editMode ? starting_date : "",
    midway_point: editMode ? midway_point : "",
    end_date: editMode ? end_date : "",
    isfinished: editMode ? isfinished : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setData((prevData) => {
      const newData = {
        ...prevData,
        [name]: newValue,
      };

      // Recheck all date constraints, regardless of which field is updated
      let newError = "";
      if (
        newData.starting_date &&
        newData.midway_point &&
        (new Date(newData.midway_point) <= new Date(newData.starting_date) ||
          (newData.end_date &&
            new Date(newData.midway_point) >= new Date(newData.end_date)))
      ) {
        newError =
          "Midpoint date must be after the start date and before the end date.";
      } else if (
        newData.midway_point &&
        newData.end_date &&
        new Date(newData.end_date) <= new Date(newData.midway_point)
      ) {
        newError = "End date must be after the mid date.";
      }

      setError(newError);

      // Check if the form is valid
      const formIsValid =
        newData.league_name.trim() !== "" &&
        newData.starting_date.trim() !== "" &&
        newData.midway_point.trim() !== "" &&
        newData.end_date.trim() !== "" &&
        !newError; // Make sure no error is present

      setIsFormValid(formIsValid);

      return newData;
    });
  };

  return (
    <section id="league-modal">
      <div className="edit-container">
        <div className="control">
          <h3>
            {mode === "edit"
              ? `Edit ${league_name} league `
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

          {mode === "edit" && (
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

          {/* {mode === "edit" && today >= new Date(end_date) && (
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
          )} */}

          {!error && (
            <button
              type="submit"
              onClick={editMode ? updateLeague : submitLeague}
              //onClick={() => submitLeague()}
              aria-label={editMode ? "Update League" : "Create new league"}
              disabled={
                !isFormValid ||
                isLoading ||
                updateLoading ||
                deleteLoading ||
                error
              }
            >
              {!isLoading &&
                !updateLoading &&
                (editMode ? "Update league" : "Create league")}

              {isLoading && "Creating"}
              {updateLoading && "Updating"}
            </button>
          )}
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>

      {mode === "edit" && (
        <button
          onClick={() => deleteLeague()}
          aria-label="Delete League from databse"
          className="delete"
          disabled={deleteLoading}
        >
          <TrashIcon width={20} />
          <span>{deleteLoading ? "Deleting" : "Delete league"}</span>
        </button>
      )}
    </section>
  );
}

export default LeagueModal;
