import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddChallengerModal from "./AddChallengerModal";

vi.mock("./NewChallengerModal", () => ({
  default: ({ selectedTeams }) => (
    <div data-testid="new-challenger-modal">
      {selectedTeams.map((team) => team.team_id).join(",")}
    </div>
  ),
}));

describe("AddChallengerModal", () => {
  const leagueParticipants = [
    {
      team_id: 1,
      event_id: 10,
      player1_firstname: "Ada",
      player1_lastname: "Lovelace",
      player2_firstname: "Alan",
      player2_lastname: "Turing",
    },
    {
      team_id: 2,
      event_id: 10,
      player1_firstname: "Grace",
      player1_lastname: "Hopper",
      player2_firstname: "Barbara",
      player2_lastname: "Liskov",
    },
    {
      team_id: 3,
      event_id: 11,
      player1_firstname: "Margaret",
      player1_lastname: "Hamilton",
      player2_firstname: "Joan",
      player2_lastname: "Clarke",
    },
  ];

  it("prevents selecting a second team from the same division", async () => {
    const user = userEvent.setup();

    render(
      <AddChallengerModal
        leagueID={4}
        leagueParticipants={leagueParticipants}
        setShowChallengerModal={vi.fn()}
      />
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Search for participants by name",
      }),
      "a"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit participant search" })
    );

    await user.click(
      await screen.findByRole("button", { name: "Add Ada Alan to team" })
    );
    await user.click(
      screen.getByRole("button", { name: "Add Grace Barbara to team" })
    );

    expect(
      await screen.findByText(
        "Challenger matches must be between different divisions"
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create challenger match" })
    ).not.toBeInTheDocument();
  });

  it("allows a challenger match when the teams are from different divisions", async () => {
    const user = userEvent.setup();

    render(
      <AddChallengerModal
        leagueID={4}
        leagueParticipants={leagueParticipants}
        setShowChallengerModal={vi.fn()}
      />
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Search for participants by name",
      }),
      "a"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit participant search" })
    );

    await user.click(
      await screen.findByRole("button", { name: "Add Ada Alan to team" })
    );
    await user.click(
      screen.getByRole("button", { name: "Add Margaret Joan to team" })
    );

    expect(
      screen.getByRole("button", { name: "Create challenger match" })
    ).toBeInTheDocument();
  });

  it("prevents selecting the same team twice", async () => {
    const user = userEvent.setup();

    render(
      <AddChallengerModal
        leagueID={4}
        leagueParticipants={leagueParticipants}
        setShowChallengerModal={vi.fn()}
      />
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Search for participants by name",
      }),
      "Ada"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit participant search" })
    );

    const addAdaButton = await screen.findByRole("button", {
      name: "Add Ada Alan to team",
    });

    await user.click(addAdaButton);
    await user.click(addAdaButton);

    expect(
      await screen.findByText("This team is already selected")
    ).toBeInTheDocument();
  });

  it("clears the search results without submitting the form again", async () => {
    const user = userEvent.setup();

    render(
      <AddChallengerModal
        leagueID={4}
        leagueParticipants={leagueParticipants}
        setShowChallengerModal={vi.fn()}
      />
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Search for participants by name",
      }),
      "Ada"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit participant search" })
    );

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Clear search results" })
    );

    expect(
      screen.getByRole("textbox", { name: "Search for participants by name" })
    ).toHaveValue("");
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("opens the challenger report form after selecting two valid teams", async () => {
    const user = userEvent.setup();

    render(
      <AddChallengerModal
        leagueID={4}
        leagueParticipants={leagueParticipants}
        setShowChallengerModal={vi.fn()}
      />
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Search for participants by name",
      }),
      "a"
    );
    await user.click(
      screen.getByRole("button", { name: "Submit participant search" })
    );

    await user.click(
      await screen.findByRole("button", { name: "Add Ada Alan to team" })
    );
    await user.click(
      screen.getByRole("button", { name: "Add Margaret Joan to team" })
    );
    await user.click(
      screen.getByRole("button", { name: "Create challenger match" })
    );

    expect(await screen.findByTestId("new-challenger-modal")).toHaveTextContent(
      "1,3"
    );
  });
});
