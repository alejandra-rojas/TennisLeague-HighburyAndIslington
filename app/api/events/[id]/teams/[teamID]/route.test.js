import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCookies, mockCreateRouteHandlerClient } = vi.hoisted(() => ({
  mockCookies: vi.fn(),
  mockCreateRouteHandlerClient: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mockCookies,
}));

vi.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: mockCreateRouteHandlerClient,
}));

import { DELETE, PUT } from "./route";

describe("app/api/events/[id]/teams/[teamID]/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
  });

  it("removes a team from an event", async () => {
    const secondEq = vi.fn().mockResolvedValue({ error: null });
    const firstEq = vi.fn(() => ({
      eq: secondEq,
    }));
    const supabase = {
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: firstEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 4, teamID: 12 } });

    expect(supabase.from).toHaveBeenCalledWith("event_teams");
    expect(firstEq).toHaveBeenCalledWith("event_id", 4);
    expect(secondEq).toHaveBeenCalledWith("team_id", 12);
    expect(await response.json()).toEqual({ data: { success: true } });
  });

  it("withdraws a team and marks related matches as withdrawn", async () => {
    const eventTeamSecondEq = vi.fn().mockResolvedValue({
      data: [{ event_id: 4, team_id: 12, team_withdrawn: true }],
      error: null,
    });
    const eventTeamFirstEq = vi.fn(() => ({
      eq: eventTeamSecondEq,
    }));
    const matchesOr = vi.fn().mockResolvedValue({
      data: [{ match_id: 20, withdrawal: true }],
      error: null,
    });
    const matchesEq = vi.fn(() => ({
      or: matchesOr,
    }));
    const supabase = {
      from: vi.fn((table) => {
        if (table === "event_teams") {
          return {
            update: vi.fn(() => ({
              eq: eventTeamFirstEq,
            })),
          };
        }

        return {
          update: vi.fn(() => ({
            eq: matchesEq,
          })),
        };
      }),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await PUT(null, { params: { id: 4, teamID: 12 } });

    expect(eventTeamFirstEq).toHaveBeenCalledWith("event_id", 4);
    expect(eventTeamSecondEq).toHaveBeenCalledWith("team_id", 12);
    expect(matchesEq).toHaveBeenCalledWith("event_id", 4);
    expect(matchesOr).toHaveBeenCalledWith("team1_id.eq.12,team2_id.eq.12");
    expect(await response.json()).toEqual({
      data: {
        eventTeams: [{ event_id: 4, team_id: 12, team_withdrawn: true }],
        matches: [{ match_id: 20, withdrawal: true }],
      },
    });
  });

  it("returns a 500 response when the event team update fails", async () => {
    const eventTeamSecondEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Update failed" },
    });
    const eventTeamFirstEq = vi.fn(() => ({
      eq: eventTeamSecondEq,
    }));
    const supabase = {
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: eventTeamFirstEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await PUT(null, { params: { id: 4, teamID: 12 } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Update failed" },
    });
  });

  it("returns the matches update error when withdrawing related matches fails", async () => {
    const eventTeamSecondEq = vi.fn().mockResolvedValue({
      data: [{ event_id: 4, team_id: 12, team_withdrawn: true }],
      error: null,
    });
    const eventTeamFirstEq = vi.fn(() => ({
      eq: eventTeamSecondEq,
    }));
    const matchesOr = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Failed to update matches" },
    });
    const matchesEq = vi.fn(() => ({
      or: matchesOr,
    }));
    const supabase = {
      from: vi.fn((table) => {
        if (table === "event_teams") {
          return {
            update: vi.fn(() => ({
              eq: eventTeamFirstEq,
            })),
          };
        }

        return {
          update: vi.fn(() => ({
            eq: matchesEq,
          })),
        };
      }),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await PUT(null, { params: { id: 4, teamID: 12 } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Failed to update matches" },
    });
  });
});
