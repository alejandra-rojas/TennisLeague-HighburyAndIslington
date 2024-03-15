import { useState } from "react";
import ChallengerMatchesPublic from "./ChallengerMatchesPublic";
import MatchesReportsPublic from "./MatchesReportsPublic";
import {
  Barlow_Condensed,
  Barlow_Semi_Condensed,
  Roboto_Condensed,
  Sofia_Sans_Semi_Condensed,
  Sofia_Sans_Condensed,
} from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
  variable: "--font-barlow",
});
const barlowSemi = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
  variable: "--font-barlowSemi",
});

function StandingsTablePublic({
  registeredTeams,
  matchesData,
  challengerMatches,
  midway_point,
  midmatches_needed,
}) {
  //console.log(registeredTeams);
  //console.log("Matches data", matchesData);
  //console.log(challengerMatches);
  //console.log(midmatches_needed)
  const [showMatchesDetails, setShowMatchesDetails] = useState(false);

  let teamStats = [];

  const generateMobileName = (fullName) => {
    const names = fullName.split(" ");
    const firstName = names[0];
    const lastNameInitial = names
      .slice(1)
      .map((name) => name.charAt(0))
      .join("");
    return `${firstName} ${lastNameInitial}`;
  };

  // Initialize the array with the registered teams
  registeredTeams.forEach((team) => {
    teamStats.push({
      team_id: team.team_id,
      team_name: team.player1name + " & " + team.player2name,
      team_mobile_name:
        generateMobileName(team.player1name) +
        " & " +
        generateMobileName(team.player2name),

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

  //console.log(teamStats);
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
    <section
      id="event-standings"
      className={`${barlow.variable} ${barlowSemi.variable}`}
    >
      <div className="event-table">
        <h5 className="sr-only">Event Standings</h5>
        <ul>
          <li className="table-header">
            <span className="invisible">Participant</span>
            <span className="md:hidden">P</span>
            <span className="hidden md:inline">Played</span>

            <span className="hide">Won</span>
            <span>Sets</span>
            <span className="md:hidden">BNS</span>
            <span className="hidden md:inline">Bonus</span>
            <span className="md:hidden">PTS</span>
            <span className="hidden md:inline">Total</span>
          </li>
          {teamStats
            .sort((a, b) => b.total_points - a.total_points)
            .map((team, index) => {
              const runnerUp = index === 0 && team.total_points !== 0;

              return (
                <li
                  key={team.team_id}
                  className={`results ${
                    team.team_withdrawn ? "withdrawn" : ""
                  } ${index % 2 === 0 ? "even-row" : "odd-row"} ${
                    runnerUp ? "runnerUp" : ""
                  }`}
                >
                  <span className="md:hidden">
                    {`${team.team_mobile_name}`}
                  </span>
                  <span className="hidden md:inline md:pl-2">
                    {`${team.team_name}`}
                  </span>
                  <span>{`${team.matches_played}/${
                    team.team_withdrawn ? allMatchesCount : totalMatches
                  }`}</span>
                  <span className="hide">{team.matches_won}</span>
                  <span>{team.sets_won}</span>
                  {/* <span className="hide">{team.mid_bonus}</span>
                  <span className="hide">{team.all_bonus}</span> */}
                  <span>
                    {team.mid_bonus + team.all_bonus + team.challenger_bonus}
                  </span>
                  <span>{team.total_points}</span>
                </li>
              );
            })}
        </ul>
      </div>

      {showMatchesDetails && (
        <div className="individual-matches">
          <MatchesReportsPublic
            matchesData={matchesData}
            midway_point={midway_point}
          />
          <ChallengerMatchesPublic
            registeredTeams={registeredTeams}
            challengerMatches={challengerMatches}
          />
        </div>
      )}

      {matchesData.some((match) => match.match_date !== null) && (
        <div
          className="individualMatches-btn"
          onClick={() => setShowMatchesDetails(!showMatchesDetails)}
        >
          {!showMatchesDetails
            ? "view individual match results"
            : "close individual match results"}
        </div>
      )}
    </section>
  );
}

export default StandingsTablePublic;
