import React from "react";
import ChallengerReportEntry from "./ChallengerReportEntry";

function ChallengerMatchesReports({ registeredTeams, challengerMatches }) {
  //console.log("Participant team objects:", registeredTeams);

  const teamIds = registeredTeams
    ? registeredTeams.map((team) => team.team_id)
    : [];
  //console.log("Event participant team ids:", teamIds);
  //console.log("Challenger matches:", challengerMatches);

  let filteredChallengerMatches = challengerMatches.filter((match) =>
    teamIds.some((id) => id === match.team1_id || id === match.team2_id)
  );

  return (
    <>
      {filteredChallengerMatches.length > 0 && (
        <div id="challenger-matches">
          <div className="standings-report">
            <h6>Challenger matches</h6>
            <section id="challengers-reports-table">
              <ul>
                <li className="md-header">
                  <span>T1</span>
                  <span>T2</span>
                  <span>Match Date</span>
                  <span>Finished</span>
                  <span>Winner Score</span>
                  <span>T1 bonus</span>
                  <span>T2 bonus</span>
                  <span>Action</span>
                </li>
                {filteredChallengerMatches?.map((match, index) => (
                  <ChallengerReportEntry
                    index={index}
                    key={match.match_id}
                    match={match}
                    // getChallengersData={getChallengersData}
                    // getEventTeamsData={getEventTeamsData}
                    // getEventMatchesData={getEventMatchesData}
                  />
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default ChallengerMatchesReports;
