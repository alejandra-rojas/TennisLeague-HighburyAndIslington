"use client";
import React, { useState } from "react";
import { createPlayer } from "./actions";

function NewPlayer() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form action={createPlayer} className="w-1/2">
      <label>
        <span>First name:</span>
        <input required type="text" name="first-name" />
      </label>
      <label>
        <span>Last name:</span>
        <input required type="text" name="last-name" />
      </label>
      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading && <span>Adding...</span>}
        {!isLoading && <span>Add Player</span>}
      </button>
    </form>
  );
}

export default NewPlayer;
