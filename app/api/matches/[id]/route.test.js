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

import { PUT } from "./route";

describe("app/api/matches/[id]/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
  });

  it("updates a match with the expected payload", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ match_id: 7 }],
      error: null,
    });
    const mockUpdate = vi.fn(() => ({
      eq: mockEq,
    }));
    const supabase = {
      from: vi.fn(() => ({
        update: mockUpdate,
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await PUT(
      new Request("http://localhost/api/matches/7", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_date: "2026-06-20",
          isfinished: true,
          winner_id: 2,
          team1_sets: 0,
          team2_sets: 2,
          winner_score: "6/4 6/4",
          byMidpoint: false,
        }),
      }),
      { params: { id: 7 } }
    );

    expect(supabase.from).toHaveBeenCalledWith("matches");
    expect(mockUpdate).toHaveBeenCalledWith({
      match_date: "2026-06-20",
      isfinished: true,
      winner_id: 2,
      team1_sets: 0,
      team2_sets: 2,
      winner_score: "6/4 6/4",
      bymidpoint: false,
    });
    expect(mockEq).toHaveBeenCalledWith("match_id", 7);
    expect(await response.json()).toEqual({ data: [{ match_id: 7 }] });
  });

  it("returns a 500 response when the update fails", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Update failed" },
    });
    const supabase = {
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await PUT(
      new Request("http://localhost/api/matches/7", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_date: "2026-06-20",
          byMidpoint: false,
        }),
      }),
      { params: { id: 7 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Update failed" },
    });
  });
});
