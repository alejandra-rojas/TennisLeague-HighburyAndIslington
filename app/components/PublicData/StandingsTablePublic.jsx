import React from "react";
import ChallengerMatchesPublic from "./ChallengerMatchesPublic";
import MatchesReportsPublic from "./MatchesReportsPublic";

function StandingsTablePublic({
  registeredTeams,
  matchesData,
  challengerMatches,
  midway_point,
  midmatches_needed,
}) {
  //console.log(registeredTeams);
  //console.log(matchesData);
  //console.log(challengerMatches);
  //console.log(midmatches_needed)

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
      matchesByMidpoint: 0,
      mid_bonus: 0,
      all_bonus: 0,
      challenger_bonus: team.challenger_bonus,
      total_points: team.total_points,
    });
  });

  // Helper function to find a team in teamStats by team_id
  function findTeamStatById(teamId) {
    return teamStats.find((teamStat) => teamStat.team_id === teamId);
  }

  function updateTotalPoints() {
    teamStats.forEach((teamStat) => {
      teamStat.total_points =
        teamStat.sets_won * 2 +
        teamStat.challenger_bonus +
        teamStat.all_bonus +
        teamStat.mid_bonus;
    });
  }
  updateTotalPoints();
  //console.log(teamStats);

  // Iterate over the matches to count matches played, sets won and matches by midpoint
  matchesData.forEach((match) => {
    // Find the statistics for both teams involved in the match
    let team1Stat = findTeamStatById(match.team1_id);
    let team2Stat = findTeamStatById(match.team2_id);

    // Only consider the match as played if it's finished
    if (match.isfinished) {
      // Increment the played matches count for both teams
      team1Stat.matches_played++;
      team2Stat.matches_played++;

      // If the match is by midpoint, increment matchesByMidpoint for both teams
      if (match.bymidpoint) {
        team1Stat.matchesByMidpoint++;
        team2Stat.matchesByMidpoint++;
      }

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

  teamStats.forEach((teamStat) => {
    if (teamStat.matchesByMidpoint >= midmatches_needed) {
      teamStat.mid_bonus = 1;
    } else {
      teamStat.mid_bonus = 0;
    }
  });
  updateTotalPoints();

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

  function calculateCombinations(n) {
    return n - 1;
  }

  const allMatchesCount = registeredTeams.length - 1;
  const activeTeamsCount = teamStats.filter((t) => !t.team_withdrawn).length;
  //console.log(activeTeamsCount)
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
            <span className="invisible">Participant</span>
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
                  <span>{`${team.matches_played}/${
                    team.team_withdrawn ? allMatchesCount : totalMatches
                  }`}</span>
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

      <MatchesReportsPublic
        matchesData={matchesData}
        midway_point={midway_point}
      />
      <ChallengerMatchesPublic
        registeredTeams={registeredTeams}
        challengerMatches={challengerMatches}
      />
    </section>
  );
}

export default StandingsTablePublic;
