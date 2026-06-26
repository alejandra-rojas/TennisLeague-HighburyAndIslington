import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { PUT } from "./route";

describe("app/api/challengers/[id]/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
  });

  it("updates a challenger match from a direct payload", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ match_id: 11 }],
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await PUT(
      new Request("http://localhost/api/challengers/11", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isfinished: true,
          match_date: "2026-06-20",
          winner_id: 2,
          winner_score: "6/4 6/4",
          team1_bonus: 1,
          team2_bonus: 3,
        }),
      }),
      { params: { id: 11 } }
    );

    expect(supabase.from).toHaveBeenCalledWith("challenger_matches");
    expect(mockUpdate).toHaveBeenCalledWith({
      isfinished: true,
      match_date: "2026-06-20",
      winner_id: 2,
      winner_score: "6/4 6/4",
      team1_bonus: 1,
      team2_bonus: 3,
    });
    expect(mockEq).toHaveBeenCalledWith("match_id", 11);
    expect(await response.json()).toEqual({ data: [{ match_id: 11 }] });
  });

  it("returns a 500 response when the challenger update fails", async () => {
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await PUT(
      new Request("http://localhost/api/challengers/11", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isfinished: false,
          match_date: "2026-06-20",
          winner_id: null,
          winner_score: "6/4 6/4",
          team1_bonus: 1,
          team2_bonus: 3,
        }),
      }),
      { params: { id: 11 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Update failed" },
    });
  });
});


