import React from "react";
import ChallengerReportEntry from "./ChallengerReportEntry";

function ChallengerMatchesReports({ registeredTeams }) {
  console.log("Participant team objects:", registeredTeams);

  const teamIds = registeredTeams
    ? registeredTeams.map((team) => team.team_id)
    : [];
  console.log("Participant team ids:", teamIds);

  /*   console.log("Challenger matches:", challengerMatchesData);
  //getting this from the league level

  let filteredChallengerMatches = [];

  if (
    Array.isArray(challengerMatchesData) &&
    challengerMatchesData.length > 0
  ) {
    filteredChallengerMatches = challengerMatchesData.filter((match) => {
      // Check if either team1_id or team2_id is included in teamIds
      return (
        teamIds.includes(match.team1_id) || teamIds.includes(match.team2_id)
      );
    });
  } */

  return (
    <>
      {/*  {filteredChallengerMatches.length > 0 && (
        <div id="challenger-matches">
          <div className="standings-report">
            <h6>Challenger matches</h6>
            <section id="challengers-reports-table">
              <ul>
                <li className="md-header">
                  <span>P1</span>
                  <span>P2</span>
                  <span>Match Date</span>
                  <span>Finished</span>
                  <span>Winner Score</span>
                  <span>P1 bonus</span>
                  <span>P2 bonus</span>
                  <span>Action</span>
                </li>
                {filteredChallengerMatches?.map((match, index) => (
                  <ChallengerReportEntry
                    index={index}
                    key={match.match_id}
                    match={match}
                    getChallengersData={getChallengersData}
                    getEventTeamsData={getEventTeamsData}
                    getEventMatchesData={getEventMatchesData}
                  />
                ))}
              </ul>
            </section>
          </div>
        </div>
      )} */}
    </>
  );
}

export default ChallengerMatchesReports;
