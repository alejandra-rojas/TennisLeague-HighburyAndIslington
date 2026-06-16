import "../../../styles/Admin/PlayersPage.scss";
//Components
import { Suspense } from "react";
import PlayerList from "./PlayerList";
import Loading from "../loading";
import AddPlayerButton from "./AddPlayerButton";

export default function PlayersAdmin() {
  return (
    <main id="players-page">
      <header>
        <div>
          <h2>Players Database</h2>
          <p>Manage the players database</p>
        </div>
        <AddPlayerButton />
      </header>

      <Suspense fallback={<Loading />}>
        <PlayerList />
      </Suspense>
    </main>
  );
}
