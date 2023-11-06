import React from "react";

function StandingsTable({ registeredTeams, matchesData }) {
  //   console.log(registeredTeams);
  //   console.log(matchesData);

  let teamStats = [];

  // Initialize the array with the registered teams
  registeredTeams.forEach((team) => {
    teamStats.push({
      team_id: team.team_id,
      team_name: team.player1name + " & " + team.player2name,
      matches_played: 0,
      matches_won: 0,
      sets_won: 0,
      team_withdrawn: team.team_withdrawn,
      mid_bonus: team.mid_bonus,
      all_bonus: team.all_bonus,
      challenger_bonus: team.challenger_bonus,
    });
  });

  // Helper function to find a team in teamStats by team_id
  function findTeamStatById(teamId) {
    return teamStats.find((teamStat) => teamStat.team_id === teamId);
  }

  // Iterate over the matches to count matches played and sets won
  matchesData.forEach((match) => {
    let team1Stat = findTeamStatById(match.team1_id);
    let team2Stat = findTeamStatById(match.team2_id);

    // Increment the played matches count for both teams
    team1Stat.played++;
    team2Stat.played++;

    // Accumulate sets won for each team
    team1Stat.sets_won += match.team1_sets;
    team2Stat.sets_won += match.team2_sets;

    // If the match is finished, increment the win count for the winner
    if (match.isfinished && !match.withdrawal && match.winner_id != null) {
      let winnerStat = findTeamStatById(match.winner_id);
      winnerStat.won++;
    }
  });

  console.log(teamStats);

  function calculateCombinations(n) {
    return n - 1;
  }
  return (
    <section id="event-standings">
      <div className="event-table">
        <h5 className="sr-only">Event Standings</h5>
        <ul>
          <li className="md-header">
            <span>Participant</span>
            <span>Played</span>
            <span>Won</span>
            {/* <span>Lost</span> */}
            <span>Sets</span>
            <span>MidB</span>
            <span>AllB</span>
            <span>ChB</span>
            <span>Total Points</span>
          </li>
          {teamStats
            .sort((a, b) => b.total_points - a.total_points)
            .map((team, index) => {
              const activeTeamsCount = teamStats.filter(
                (t) => !t.team_withdrawn
              ).length;
              //console.log(activeTeamsCount);
              const totalMatches = calculateCombinations(activeTeamsCount);

              return (
                <li
                  key={team.team_id}
                  className={`${team.team_withdrawn ? "withdrawn" : ""} ${
                    index % 2 === 0 ? "even-row" : "odd-row"
                  }`}
                >
                  <span>{`${team.team_name}`}</span>
                  <span>{`${team.matches_played}/${totalMatches}`}</span>
                  <span className="hide">{team.matches_won}</span>
                  {/* <span className="hide">
                {team.played_matches - team.team_wins}
              </span> */}
                  <span className="hide">{team.sets_won}</span>
                  <span className="hide">{team.mid_bonus}</span>
                  <span className="hide">{team.all_bonus}</span>
                  <span className="hide">{team.challenger_bonus}</span>
                  <span>{team.total_points}</span>
                </li>
              );
            })}
        </ul>
      </div>

      {/* <StandingsReport
        eventMatchesData={eventMatchesData}
        getEventMatchesData={getEventMatchesData}
        getEventTeamsData={getEventTeamsData}
      /> */}

      {/* {filteredChallengerMatches.length > 0 && (
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

      {/* <div id="team-withdrawal-form">
        <div>
          <h6>Withdraw participant</h6>
        </div>
        <form>
          <select
            id="withdrawal"
            name="winner_id"
            value={selectedTeamWId}
            onChange={(e) => setSelectedTeamWId(e.target.value)}
            aria-label="Select the player who has withdrawn"
          >
            <option value="">Select participant</option>
            {eventTeams
              .filter((team) => !team.team_withdrawn) // Filter out teams with team_withdrawal true
              .map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {`${team.player1_firstname} ${team.player1_lastname} & ${team.player2_firstname} ${team.player2_lastname}`}
                </option>
              ))}
          </select>

          {selectedTeamWId && (
            <>
              <button
                type="submit"
                onClick={(e) => withdrawTeam(e, selectedTeamWId)}
                aria-label="Report Withdrawal"
                disabled={!selectedTeamWId}
              >
                Complete withdrawal
              </button>{" "}
              <div className="undone">
                <ExclamationTriangleIcon width={25} />
                <span>This action cannot be undone</span>
              </div>
            </>
          )}
        </form>
      </div> */}
    </section>
  );
}

export default StandingsTable;
