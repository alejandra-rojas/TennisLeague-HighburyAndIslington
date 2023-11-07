import React from "react";

function ChallengerMatches() {
  return {
    /* {filteredChallengerMatches.length > 0 && (
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
      )} */
  };
}

export default ChallengerMatches;
