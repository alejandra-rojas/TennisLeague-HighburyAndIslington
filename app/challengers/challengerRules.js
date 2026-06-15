export function areTeamsInSameDivision(team1, team2) {
  if (team1?.event_id == null || team2?.event_id == null) {
    return false;
  }

  return String(team1.event_id) === String(team2.event_id);
}

export function isSameDivisionChallengerMatch(challenger) {
  if (
    challenger?.team1_event_id == null ||
    challenger?.team2_event_id == null
  ) {
    return false;
  }

  return String(challenger.team1_event_id) === String(challenger.team2_event_id);
}
