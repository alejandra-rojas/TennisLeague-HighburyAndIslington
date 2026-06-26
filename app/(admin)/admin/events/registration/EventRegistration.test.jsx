import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import EventRegistration from "./EventRegistration";

const { mockAxiosPost } = vi.hoisted(() => ({
  mockAxiosPost: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    post: mockAxiosPost,
  },
}));

vi.mock("./ParticipantList", () => ({
  default: ({ registeredTeams }) => (
    <div data-testid="participant-list">participants:{registeredTeams.length}</div>
  ),
}));

vi.mock("./PlayerSearch", () => ({
  default: ({ event }) => <div data-testid="player-search">search:{event}</div>,
}));

function renderWithQueryClient(ui, queryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("EventRegistration", () => {
  beforeEach(() => {
    mockAxiosPost.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates the round-robin draw payload and invalidates the draw query", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    mockAxiosPost.mockResolvedValue({ data: { data: [{ match_id: 21 }] } });

    renderWithQueryClient(
      <EventRegistration
        event={4}
        registeredTeams={[
          { team_id: 11 },
          { team_id: 12 },
          { team_id: 13 },
          { team_id: 14 },
        ]}
      />,
      queryClient
    );

    expect(screen.getByTestId("participant-list")).toHaveTextContent(
      "participants:4"
    );

    await user.click(
      screen.getByRole("button", { name: "Create matches table" })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith("/api/matches", {
      matches: [
        { event_id: 4, team1_id: 11, team2_id: 12 },
        { event_id: 4, team1_id: 11, team2_id: 13 },
        { event_id: 4, team1_id: 11, team2_id: 14 },
        { event_id: 4, team1_id: 12, team2_id: 13 },
        { event_id: 4, team1_id: 12, team2_id: 14 },
        { event_id: 4, team1_id: 13, team2_id: 14 },
      ],
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["event-draw", 4],
      });
    });
  });

  it("shows the empty registration state and hides draw creation when fewer than four teams exist", () => {
    const queryClient = new QueryClient();

    renderWithQueryClient(
      <EventRegistration event={4} registeredTeams={[]} />,
      queryClient
    );

    expect(
      screen.getByText(
        "There are no participants on this event yet. To add a participant to an event, search for them using the search field below."
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create matches table" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("player-search")).toHaveTextContent("search:4");
  });

  it("disables draw creation while the request is in flight and recovers after failure", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    let rejectRequest;
    mockAxiosPost.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        })
    );

    renderWithQueryClient(
      <EventRegistration
        event={4}
        registeredTeams={[
          { team_id: 11 },
          { team_id: 12 },
          { team_id: 13 },
          { team_id: 14 },
        ]}
      />,
      queryClient
    );

    const createButton = screen.getByRole("button", {
      name: "Create matches table",
    });

    await user.click(createButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(createButton).toBeDisabled();
      expect(createButton).toHaveTextContent("Creating standings table...");
    });

    rejectRequest(new Error("Create draw failed"));

    await waitFor(() => {
      expect(createButton).not.toBeDisabled();
      expect(createButton).toHaveTextContent("Create standings table");
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
