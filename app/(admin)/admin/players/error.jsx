"use client";
//for server actions

export default function error({ error, reset }) {
  return (
    <main>
      <h2>Oh No!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Maybe try again?</button>
    </main>
  );
}
