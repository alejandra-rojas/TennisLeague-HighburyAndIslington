"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CreateTeam({ setShowCreateTeamModal }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="new-team-modal">
      <div className="controls">
        <h3>Create new team</h3>
        <button
          aria-label={`Close create team modal`}
          onClick={() => {
            setShowCreateTeamModal(false);
          }}
        >
          <XMarkIcon width={25} />
          <span>close</span>
        </button>
      </div>

      {/* <form className="form-create-player" onSubmit={handleSubmit}>
        <div className="input">
          <label>First name:</label>
          <input
            required
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </div>

        <div className="input">
          <label>Last name:</label>
          <input
            required
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </div>

        <button disabled={isLoading}>
          {isLoading && <span>Adding...</span>}
          {!isLoading && <span>Add Player</span>}
        </button>
      </form> */}
    </div>
  );
}
