"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CreatePlayer({ setShowPlayerModal }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const player = {
      firstname: firstName,
      lastname: lastName,
    };

    const res = await fetch(`/api/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });

    const json = await res.json();

    if (json.error) {
      console.log(json.error);
      setIsLoading(false);
      return;
    }
    if (json.data) {
      router.refresh();
      router.push("/admin/players");
      setIsLoading(false);
      setFirstName("");
      setLastName("");
    }
  };

  return (
    <div className="new-player-modal">
      <div className="controls">
        <h3>Register new player</h3>
        <button
          aria-label={`Close new player modal`}
          onClick={() => {
            setShowPlayerModal(false);
          }}
        >
          <XMarkIcon width={25} />
          <span>close</span>
        </button>
      </div>
      <form className="form-create-player" onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="create-player-first-name">First name:</label>
          <input
            id="create-player-first-name"
            required
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </div>

        <div className="input">
          <label htmlFor="create-player-last-name">Last name:</label>
          <input
            id="create-player-last-name"
            required
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </div>

        <button disabled={isLoading}>
          {isLoading && <span>Adding...</span>}
          {!isLoading && <span>Add Player</span>}
        </button>
      </form>
    </div>
  );
}
