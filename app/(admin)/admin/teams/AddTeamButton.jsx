"use client";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import CreateTeam from "./CreateTeam";

export default function AddTeamButton() {
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  return (
    <>
      {!showCreateTeamModal && (
        <button
          onClick={() => setShowCreateTeamModal(true)}
          aria-label="Create Doubles Team"
          className="create-team-button"
        >
          <UserGroupIcon width={30} />
          Create team
        </button>
      )}

      {showCreateTeamModal && (
        <CreateTeam setShowCreateTeamModal={setShowCreateTeamModal} />
      )}
    </>
  );
}
