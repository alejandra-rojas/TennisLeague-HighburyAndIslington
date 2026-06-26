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

import { GET } from "./route";

describe("app/api/leagues/[id]/teams/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
  });

  it("returns 400 when the league id is missing", async () => {
    const response = await GET(null, { params: {} });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { message: "Missing or invalid league id" },
    });
  });

  it("returns unique league participants across events", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [
        {
          event_teams: [
            {
              event_id: 7,
              team_id: 11,
              team: {
                player1: { firstname: "Ada", lastname: "Lovelace" },
                player2: { firstname: "Grace", lastname: "Hopper" },
              },
            },
            {
              event_id: 7,
              team_id: 11,
              team: {
                player1: { firstname: "Ada", lastname: "Lovelace" },
                player2: { firstname: "Grace", lastname: "Hopper" },
              },
            },
            {
              event_id: 8,
              team_id: 12,
              team: {
                player1: { firstname: "Alan", lastname: "Turing" },
                player2: { firstname: "Joan", lastname: "Clarke" },
              },
            },
          ],
        },
      ],
      error: null,
    });
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await GET(null, { params: { id: 3 } });

    expect(supabase.from).toHaveBeenCalledWith("events");
    expect(mockEq).toHaveBeenCalledWith("league_id", 3);
    expect(await response.json()).toEqual({
      data: [
        {
          team_id: 11,
          event_id: 7,
          player1_firstname: "Ada",
          player1_lastname: "Lovelace",
          player2_firstname: "Grace",
          player2_lastname: "Hopper",
        },
        {
          team_id: 12,
          event_id: 8,
          player1_firstname: "Alan",
          player1_lastname: "Turing",
          player2_firstname: "Joan",
          player2_lastname: "Clarke",
        },
      ],
    });
  });

  it("returns 500 when the participant query fails", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Query failed" },
    });
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await GET(null, { params: { id: 3 } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Query failed" },
    });
  });
});
