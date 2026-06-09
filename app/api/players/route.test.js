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

describe("app/api/players/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
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

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

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
      error: null,
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

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

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

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Failed to fetch players" },
    });
  });
});
