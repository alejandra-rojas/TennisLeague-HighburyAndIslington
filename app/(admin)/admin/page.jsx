"use client";
import "../../styles/Admin/Leagues.scss";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState, Suspense } from "react";
import Loading from "./loading";
import Leagues from "./leagues/Leagues";
import LeagueModal from "./leagues/LeagueModal";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SecondaryAdminNav from "../../components/admin/SecondaryAdminNav";

export default function Admin() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const isActive = (href) => pathname === href;

  return (
    <main>
      <SecondaryAdminNav setShowModal={setShowModal} />

      {showModal && <LeagueModal mode={"create"} setShowModal={setShowModal} />}

      <section id="current-leagues">
        <header id="league-section-header" className="sr-only">
          <h2>Ongoing and Future Leagues</h2>
          <p>
            Leagues that are not finished and todays date is within the range of
            the start and end date
          </p>
        </header>

        <section id="current-leagues-data">
          <Suspense fallback={<Loading />}>
            <Leagues />
          </Suspense>

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
