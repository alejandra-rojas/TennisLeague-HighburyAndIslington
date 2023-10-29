import "../styles/Root.scss";
import Link from "next/link";

export default function ClientNavbar() {
  return (
    <>
      <header id="web-header">
        <div id="primary-navigation">
          <div>
            <Link href="/" aria-label="Go to the Home page">
              <h1>Highbury Fields Doubles Leagues </h1>
            </Link>
          </div>
          <div>
            <nav role="navigation" aria-labelledby="primary-navigation">
              <h2 id="primary-site-navigation" className="sr-only">
                Home Site Navigation
              </h2>
              <ul>
                <li>
                  <Link
                    href={"/report-results"}
                    aria-label="Go to the Home page"
                  >
                    Report Results
                  </Link>
                </li>
                <li>
                  <Link href={"/rules"} aria-label="Go to About page">
                    Rules
                  </Link>
                </li>
                <li>
                  <Link href={"/past-leagues"} aria-label="Go to Admin page">
                    Past Leagues
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
