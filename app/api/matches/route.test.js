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

import { POST } from "./route";

describe("app/api/matches/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("inserts generated matches and returns a 201 response", async () => {
    const matches = [{ event_id: 1, team1_id: 10, team2_id: 11 }];
    const supabase = {
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          data: matches,
          error: null,
        }),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await POST(
      new Request("http://localhost/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches }),
      })
    );

    expect(supabase.from).toHaveBeenCalledWith("matches");
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ data: matches });
  });

  it("returns a 500 response when insert fails", async () => {
    const supabase = {
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Insert failed" },
        }),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await POST(
      new Request("http://localhost/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches: [{ event_id: 1 }] }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Insert failed" });
  });
});
