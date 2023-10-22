"use client";
import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
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
      <form id="edit-player-form">
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
        onClick={() => {
          setShowPlayerModal(false);
        }}
      >
        Exit edit
      </button>
    </>
  );
}

export default EditPlayerModal;
