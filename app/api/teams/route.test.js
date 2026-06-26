import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { GET, POST } from "./route";

describe("app/api/teams/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
  });

  it("formats teams for a successful GET request", async () => {
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: [
            {
              team_id: 1,
              player1_id: 10,
              player2_id: 11,
              player1: { firstname: "Ada", lastname: "Lovelace" },
              player2: { firstname: "Grace", lastname: "Hopper" },
            },
          ],
          error: null,
        }),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: [
        {
          team_id: 1,
          player1_id: 10,
          player2_id: 11,
          player1_firstname: "Ada",
          player1_lastname: "Lovelace",
          player2_firstname: "Grace",
          player2_lastname: "Hopper",
        },
      ],
    });
  });

  it("returns a 500 response when the team GET request fails", async () => {
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Failed to fetch teams" },
        }),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Failed to fetch teams" },
    });
  });

  it("creates a team with the selected player ids", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { team_id: 4, player1_id: 10, player2_id: 11 },
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await POST(
      new Request("http://localhost/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1_id: 10,
          player2_id: 11,
        }),
      })
    );

    expect(supabase.from).toHaveBeenCalledWith("teams");
    expect(mockInsert).toHaveBeenCalledWith({
      player1_id: 10,
      player2_id: 11,
    });
    expect(await response.json()).toEqual({
      data: { team_id: 4, player1_id: 10, player2_id: 11 },
    });
  });

  it("returns a 500 response with a normalized message when team creation fails", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: {
        message: "duplicate key value violates unique constraint",
        details: "This team already exists.",
        code: "23505",
      },
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await POST(
      new Request("http://localhost/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1_id: 10,
          player2_id: 11,
        }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: {
        message: "This team already exists.",
        code: "23505",
      },
    });
  });
});


