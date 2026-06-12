"use client";
import { startTransition, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTransition } from "react";
import { deletePlayer } from "./actions";

export default function DeleteButton({ id }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);

    const res = await fetch(`/api/players/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (json.error) {
      toast.error(
        json.error.message || "An error occurred while deleting the player."
      );
      setIsLoading(false);
    } else {
      toast.success("Player deleted succesfully");
      router.refresh();
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading} className="delete">
      {isLoading && (
        <>
          <TiDelete />
          Deleting...
        </>
      )}
      {!isLoading && (
        <>
          <TrashIcon width={20} />
          <span>Delete</span>
        </>
      )}
    </button>
  );
}
