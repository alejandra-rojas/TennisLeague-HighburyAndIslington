"use client";
import { useState } from "react";
import EditTeamModal from "./EditTeamModal";

export default function EditButton({ team, id }) {
  //console.log(id);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      {!showEditModal && (
        <button
          className="blue-underline"
          onClick={() => setShowEditModal(true)}
        >
          Edit team
        </button>
      )}
      {showEditModal && (
        <EditTeamModal
          team={team}
          id={id}
          setShowEditModal={setShowEditModal}
        />
      )}
    </>
  );
}
