import "../../../styles/Admin/ChallengerMatch.scss";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import AddChallengerModal from "./AddChallengerModal";

function ChallengerLeagueLevel({ hasStarted, leagueID, leagueParticipants }) {
  const [showChallengerModal, setShowChallengerModal] = useState(false);

  return (
    <section id="league-challengers">
      {!showChallengerModal && hasStarted && (
        <button
          onClick={() => setShowChallengerModal(true)}
          className="add-challenger"
        >
          <PlusIcon width={25} />
          <h6>Add a challenger match</h6>
        </button>
      )}
      {showChallengerModal && (
        <AddChallengerModal
          leagueID={leagueID}
          setShowChallengerModal={setShowChallengerModal}
          leagueParticipants={leagueParticipants}
          //getChallengersData={getChallengersData}
        />
      )}
    </section>
  );
}

export default ChallengerLeagueLevel;
