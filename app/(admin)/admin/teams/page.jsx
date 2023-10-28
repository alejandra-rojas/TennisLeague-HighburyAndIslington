import "../../../styles/Admin/TeamsPage.scss";

//Components
import { Suspense } from "react";

import Loading from "../loading";
import AddTeamButton from "./AddTeamButton";
import TeamsList from "./TeamsList";

export default function TeamsAdmin() {
  return (
    <main id="teams-page">
      <header>
        <div>
          <h2>Teams Database</h2>
          <p>Manage your teams</p>
        </div>
        <AddTeamButton />
      </header>

      <Suspense fallback={<Loading />}>
        <TeamsList />
      </Suspense>
    </main>
  );
}
