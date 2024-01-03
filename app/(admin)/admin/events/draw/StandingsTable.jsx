import React from "react";
import MatchesReports from "./MatchesReports";
import WithdrawalForm from "./WithdrawalForm";
import ChallengerMatchesReports from "../../challengers/event_entries/ChallengerMatchesReports";

function StandingsTable({ registeredTeams, matchesData, challengerMatches }) {
  //console.log(registeredTeams);
  //console.log(matchesData);
  console.log(challengerMatches);

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
      total_points: team.total_points,
    });
  });

  // Helper function to find a team in teamStats by team_id
  function findTeamStatById(teamId) {
    return teamStats.find((teamStat) => teamStat.team_id === teamId);
  }

  // Iterate over the matches to count matches played and sets won
  matchesData.forEach((match) => {
    // Find the statistics for both teams involved in the match
    let team1Stat = findTeamStatById(match.team1_id);
    let team2Stat = findTeamStatById(match.team2_id);

    // Only consider the match as played if it's finished
    if (match.isfinished) {
      // Increment the played matches count for both teams
      team1Stat.matches_played++;
      team2Stat.matches_played++;

      // If there is no withdrawal, increment the win count for the winner
      if (!match.withdrawal && match.winner_id != null) {
        let winnerStat = findTeamStatById(match.winner_id);
        winnerStat.matches_won++;
      }
    }

    // Accumulate sets won for each team
    team1Stat.sets_won += match.team1_sets;
    team2Stat.sets_won += match.team2_sets;
  });

  challengerMatches.forEach((match) => {
    // Check if team1_id belongs to the event
    let eventTeamStat = findTeamStatById(match.team1_id);

    if (eventTeamStat) {
      // It's team1 from the event, so apply team1_bonus to challenger_bonus
      eventTeamStat.challenger_bonus += match.team1_bonus;
    } else {
      // If team1_id is not part of the event, check for team2_id
      eventTeamStat = findTeamStatById(match.team2_id);
      if (eventTeamStat) {
        // It's team2 from the event, so apply team2_bonus to challenger_bonus
        eventTeamStat.challenger_bonus += match.team2_bonus;
      }
    }
  });

  function updateTotalPoints() {
    teamStats.forEach((teamStat) => {
      teamStat.total_points =
        (teamStat.sets_won * 2) +
        teamStat.challenger_bonus +
        teamStat.all_bonus +
        teamStat.mid_bonus;
    });
  }

  updateTotalPoints();
  //console.log(teamStats);

  function calculateCombinations(n) {
    return n - 1;
  }
  const activeTeamsCount = teamStats.filter((t) => !t.team_withdrawn).length;
  const totalMatches = calculateCombinations(activeTeamsCount);

  teamStats.forEach((teamStat) => {
    if (!teamStat.team_withdrawn && teamStat.matches_played === totalMatches) {
      // If a team played all their matches and hasn't withdrawn, they get the all_bonus
      teamStat.all_bonus = 1;
    }
  });
  updateTotalPoints();

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

      <MatchesReports matchesData={matchesData} />
      <ChallengerMatchesReports
        registeredTeams={registeredTeams}
        challengerMatches={challengerMatches}
      />
      <WithdrawalForm registeredTeams={registeredTeams} />
    </section>
  );
}

export default StandingsTable;