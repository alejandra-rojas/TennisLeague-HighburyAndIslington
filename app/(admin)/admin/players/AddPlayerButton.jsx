"use client";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CreatePlayer from "./CreatePlayer";

export default function AddPlayerButton() {
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  return (
    <>
      {!showPlayerModal && (
        <button
          onClick={() => setShowPlayerModal(true)}
          aria-label="Add Player"
          className="add-player-button"
        >
          <UserPlusIcon width={30} />
          Register Player
        </button>
      )}

      {showPlayerModal && (
        <CreatePlayer setShowPlayerModal={setShowPlayerModal} />
      )}
    </>
  );
}
