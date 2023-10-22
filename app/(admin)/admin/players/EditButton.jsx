"use client";
import { startTransition, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePlayer } from "./actions";
import EditPlayerModal from "./EditPlayerModal";

export default function EditButton({ player, id }) {
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  return (
    <>
      {!showPlayerModal && (
        <button onClick={() => setShowPlayerModal(true)}>Edit player</button>
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
