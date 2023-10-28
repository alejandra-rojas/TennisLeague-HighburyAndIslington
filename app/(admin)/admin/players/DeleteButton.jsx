"use client";
import { startTransition, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePlayer } from "./actions";

export default function DeleteButton({ id }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    //console.log("deleting id", id);
    const res = await fetch(`http://localhost:3000/api/players/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (json.error) {
      console.log(json.error);
      setIsLoading(false);
    }
    if (!json.error) {
      router.refresh();
      // router.push("/admin");
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

/* export default function DeleteButton({ id }) {
  const [isPending, startTransition] = useTransition(false);

  return (
    <button onClick={() => startTransition(() => deletePlayer(id))}>
      {isPending && (
        <>
          <TiDelete />
          Deleting...
        </>
      )}
      {!isPending && (
        <>
          <TiDelete />
          Delete Ticket
        </>
      )}
    </button>
  );
} */
