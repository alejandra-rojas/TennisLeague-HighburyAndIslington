"use client";
import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./DeleteButton";

function EditPlayerModal({ player, id, setShowPlayerModal }) {
  const editPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/players/${player.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 200) {
        console.log("edited");
        getPlayersData();
        setShowPlayerModal(false);
        toast.success(`Player has been modified succesfully`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div id="edit-player-modal">
        <form className="edit-form">
          <div className="input">
            <input
              id="firstName"
              required
              maxLength={30}
              placeholder="John"
              name="firstname"
              aria-labelledby="modalTitle"
              value={player.firstname}
            />
          </div>

          <div className="input">
            <input
              id="lastName"
              required
              maxLength={30}
              placeholder="Doe"
              name="lastname"
              value={player.lastname}
            />
          </div>

          <button type="submit">Edit</button>
        </form>

        <DeleteButton id={id} />
        <button
          className="exit"
          onClick={() => {
            setShowPlayerModal(false);
          }}
        >
          <XMarkIcon width={25} />
          <span>exit edit</span>
        </button>
      </div>
    </>
  );
}

export default EditPlayerModal;
