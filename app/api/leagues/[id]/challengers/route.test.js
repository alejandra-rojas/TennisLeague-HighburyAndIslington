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

import { GET, POST } from "./route";

describe("app/api/leagues/[id]/challengers/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 when the league id is missing", async () => {
    const response = await GET(null, { params: {} });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { message: "Missing or invalid league id" },
    });
  });

  it("returns challenger matches for a league", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ match_id: 4, league_id: 2 }],
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

    const response = await GET(null, { params: { id: 2 } });

    expect(supabase.from).toHaveBeenCalledWith("challenger_matches");
    expect(mockEq).toHaveBeenCalledWith("league_id", 2);
    expect(await response.json()).toEqual({
      data: [{ match_id: 4, league_id: 2 }],
    });
  });

  it("rejects same-division challenger matches", async () => {
    const response = await POST(
      new Request("http://localhost/api/leagues/2/challengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1_id: 11,
          team1_event_id: 5,
          team2_id: 12,
          team2_event_id: 5,
        }),
      }),
      { params: { id: 2 } }
    );

    expect(response.status).toBe(400);
    expect(mockCreateRouteHandlerClient).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({
      error: {
        message: "Challenger matches must be between different divisions",
      },
    });
  });

  it("creates a cross-division challenger match", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { match_id: 9, league_id: 2 },
      error: null,
    });
    const mockSelect = vi.fn(() => ({
      single: mockSingle,
    }));
    const mockInsert = vi.fn(() => ({
      select: mockSelect,
    }));
    const supabase = {
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const challenger = {
      team1_id: 11,
      team1_event_id: 5,
      team2_id: 12,
      team2_event_id: 6,
      isfinished: true,
      match_date: "2026-06-15",
      winner_id: 12,
      winner_score: "6/4 6/3",
      team1_bonus: 1,
      team2_bonus: 3,
    };

    const response = await POST(
      new Request("http://localhost/api/leagues/2/challengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challenger),
      }),
      { params: { id: 2 } }
    );

    expect(mockInsert).toHaveBeenCalledWith({
      league_id: 2,
      team1_id: 11,
      team1_event_id: 5,
      team2_id: 12,
      team2_event_id: 6,
      isfinished: true,
      match_date: "2026-06-15",
      winner_id: 12,
      winner_score: "6/4 6/3",
      team1_bonus: 1,
      team2_bonus: 3,
    });
    expect(await response.json()).toEqual({
      data: { match_id: 9, league_id: 2 },
    });
  });

  it("returns a 500 response when challenger creation fails", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });
    const supabase = {
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: mockSingle,
          })),
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await POST(
      new Request("http://localhost/api/leagues/2/challengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1_id: 11,
          team1_event_id: 5,
          team2_id: 12,
          team2_event_id: 6,
        }),
      }),
      { params: { id: 2 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Insert failed" },
    });
  });
});
