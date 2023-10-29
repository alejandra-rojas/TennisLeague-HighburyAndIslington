"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { XMarkIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./DeleteButton";

function EditPlayerModal({ player, id, setShowPlayerModal }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    firstname: player.firstname,
    lastname: player.lastname,
  });

  const handleChange = (e) => {
    //console.log("changing", e);
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));

    //console.log(data);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const player = {
      firstname: data.firstname,
      lastname: data.lastname,
    };

    const res = await fetch(`${baseUrl}/api/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    const json = await res.json();

    if (json.error) {
      console.log(json.error);
      setIsLoading(false);
    }
    if (!json.error) {
      setShowPlayerModal(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <div id="edit-player-modal">
        <form className="edit-form" onSubmit={handleClick}>
          <div className="input">
            <input
              id="firstName"
              required
              maxLength={30}
              placeholder="firstname"
              name="firstname"
              aria-labelledby="modalTitle"
              value={data.firstname}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            <input
              id="lastName"
              required
              maxLength={30}
              placeholder="lastname"
              name="lastname"
              value={data.lastname}
              onChange={handleChange}
            />
          </div>

          <button disabled={isLoading}>
            {isLoading && <>Editing...</>}
            {!isLoading && (
              <>
                <span>EDIT</span>
              </>
            )}
          </button>
        </form>

        <DeleteButton id={id} />
        <button
          className="exit"
          onClick={() => {
            setShowPlayerModal(false);
          }}
        >
          <XMarkIcon width={25} />
          <span>exit edit mode</span>
        </button>
      </div>
    </>
  );
}

export default EditPlayerModal;
