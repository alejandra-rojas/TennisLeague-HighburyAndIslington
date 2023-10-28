"use client";
import { useState } from "react";
import EditPlayerModal from "./EditPlayerModal";

export default function EditButton({ player, id }) {
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  return (
    <>
      {!showPlayerModal && (
        <button
          className="blue-underline"
          onClick={() => setShowPlayerModal(true)}
        >
          Edit player
        </button>
      )}
      {showPlayerModal && (
        <EditPlayerModal
          player={player}
          id={id}
          setShowPlayerModal={setShowPlayerModal}
        />
      )}
    </>
  );
}
