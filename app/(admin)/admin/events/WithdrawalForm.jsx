import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

function WithdrawalForm({ registeredTeams }) {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const event = registeredTeams[0].event_id;

  //UPDATE EVENT
  const { mutate: withdrawTeam, isLoading: isWithdrawing } = useMutation({
    mutationFn: async () =>
      await axios.put(`/api/events/${event}/teams/${selectedTeamId}`),

    onSuccess: () => {
      setSelectedTeamId("");
      queryClient.invalidateQueries(["event-draw", event]);
      queryClient.invalidateQueries(["event-participants", event]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleWithdrawal = (e, selectedTeamId) => {
    e.preventDefault();
    withdrawTeam(selectedTeamId);
  };
  return (
    <div id="team-withdrawal-form">
      <div>
        <h6>Withdraw team</h6>
      </div>
      <form>
        <select
          id="withdrawal"
          name="winner_id"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          aria-label="Select the player who has withdrawn"
        >
          <option value="">Select team</option>
          {registeredTeams
            .filter((team) => !team.team_withdrawn) // Filter out teams with team_withdrawal true
            .map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {`${team.player1name} & ${team.player2name} `}
              </option>
            ))}
        </select>

        {selectedTeamId && (
          <>
            <button
              type="submit"
              onClick={(e) => handleWithdrawal(e, selectedTeamId)}
              aria-label="Report Withdrawal"
              disabled={!selectedTeamId}
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
    </div>
  );
}

export default WithdrawalForm;
