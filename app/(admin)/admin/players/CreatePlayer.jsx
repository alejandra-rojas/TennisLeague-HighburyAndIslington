"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePlayer() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const player = {
      player_firstname: firstName,
      player_lastname: lastName,
    };

    const res = await fetch("http://localhost:3000/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });

    const json = await res.json();

    if (json.error) {
      console.log(error.message);
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
    <form onSubmit={handleSubmit} className="w-1/2">
      <label>
        <span>First name:</span>
        <input
          required
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
      </label>
      <label>
        <span>Last name:</span>
        <input
          required
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
      </label>
      <button className="btn-primary" disabled={isLoading}>
        {isLoading && <span>Adding...</span>}
        {!isLoading && <span>Add Player</span>}
      </button>
    </form>
  );
}
