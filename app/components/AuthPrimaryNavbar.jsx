import Link from "next/link";
import React from "react";
import "../styles/Admin/Nav.scss";

function AuthPrimaryNavbar() {
  return (
    <>
      <div id="auth-navigation">
        <div>
          <Link href="/" aria-label="Go to the Home page">
            <h1>Doubles League Admin</h1>
          </Link>
        </div>
        <div>
          <nav role="navigation" aria-labelledby="primary-navigation">
            <h2 id="primary-site-navigation" className="sr-only">
              Home Site Navigation
            </h2>
            <ul>
              <li>
                <Link href={"/"} aria-label="Go to the Home page">
                  Back to the home page
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default AuthPrimaryNavbar;
