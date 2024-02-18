import Link from "next/link";
import "./styles/Root.scss";

import { Barlow_Semi_Condensed } from "next/font/google";

const barlow = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
  variable: "--font-barlow",
});

export default function NotFound() {
  return (
    <main className={`${barlow.variable} fourofour`}>
      <div className="container">
        <h2>OUT!</h2>
        <p>We could not find the page you were looking for.</p>
        <p className="back">
          <Link href="/"> Go back to the main page</Link>
        </p>
      </div>
    </main>
  );
}
