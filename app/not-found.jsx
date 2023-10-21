import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h2>We dropped the ball</h2>
      <p>We could not find the page you were looking for.</p>
      <p>
        Go back to the <Link href="/">main page</Link>
      </p>
    </main>
  );
}
