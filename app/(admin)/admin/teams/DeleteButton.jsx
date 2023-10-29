"use client";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    console.log("deleting id", id);
    const res = await fetch(`${baseUrl}/api/teams/${id}`, {
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
