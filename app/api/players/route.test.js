import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { GET, POST } from "./route";

describe("app/api/players/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
  });

  it("creates a player with the request body payload", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 1, firstname: "Ada", lastname: "Lovelace" },
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
      new Request("http://localhost/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: "Ada",
          lastname: "Lovelace",
        }),
      })
    );

    expect(supabase.from).toHaveBeenCalledWith("players");
    expect(mockInsert).toHaveBeenCalledWith({
      firstname: "Ada",
      lastname: "Lovelace",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: { id: 1, firstname: "Ada", lastname: "Lovelace" },
    });
  });

  it("returns a 500 response when player creation fails", async () => {
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await POST(
      new Request("http://localhost/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: "Ada",
          lastname: "Lovelace",
        }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Insert failed" },
    });
  });

  it("returns player data for a successful GET request", async () => {
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 1, firstname: "Ada", lastname: "Lovelace" }],
          error: null,
        }),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: [{ id: 1, firstname: "Ada", lastname: "Lovelace" }],
    });
  });

  it("returns a 500 response when the GET request fails", async () => {
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Failed to fetch players" },
        }),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Failed to fetch players" },
    });
  });
});


