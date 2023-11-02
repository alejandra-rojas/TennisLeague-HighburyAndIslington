"use client";
import { useState } from "react";
import Leagues from "./leagues/Leagues";
import "../../styles/Admin/Leagues.scss";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import LeagueModal from "./leagues/LeagueModal";

export default function Admin() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main>
      <section id="leagues-layout-header">
        <a href="#leaguescontent" className="sr-only">
          Skip to leagues section content
        </a>
        <section id="admin-secondary-navigation-leagues">
          <nav aria-labelledby="admin-secondary-navigation-leagues-label">
            <div
              id="admin-secondary-navigation-leagues-label"
              className="sr-only"
            >
              Navigation for Leagues Section
            </div>
            <ul>
              <li>
                <a to={"ongoing"} aria-label="Go to ongoing leagues page">
                  Current
                </a>
              </li>
              <li>
                <a to={"finished"} aria-label="Go to finished leagues page">
                  Finished
                </a>
              </li>

              <li>
                <a onClick={() => setShowModal(true)} className="create-league">
                  <PlusCircleIcon width={35} />
                  <span>
                    New <span className="">league</span>
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </section>
      </section>

      {showModal && (
        <LeagueModal
          mode={"create"}
          setShowModal={setShowModal}
          // getData={getData}
        />
      )}

      <section id="current-leagues">
        <header id="league-section-header" className="sr-only">
          <h2>Ongoing and Future Leagues</h2>
          <p>
            Leagues that are not finished and todays date is within the range of
            the start and end date
          </p>
        </header>

        <section id="current-leagues-data">
          <h2>Current leagues are displayed here</h2>
          <Leagues />
          {/* <ul>
            {unfinishedLeagues?.map((league) => (
              <LeagueEntry key={league.id} league={league} getData={getData} />
            ))}
          </ul> */}
        </section>
      </section>
    </main>
  );
}
