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

describe("app/api/events/[id]/teams/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 when the event id is missing", async () => {
    const response = await GET(null, { params: {} });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { message: "Missing or invalid id" },
    });
  });

  it("formats event team entries with player names", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [
        {
          event_id: 4,
          team_id: 12,
          team: {
            player1: { firstname: "Ada", lastname: "Lovelace" },
            player2: { firstname: "Grace", lastname: "Hopper" },
          },
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

    const response = await GET(null, { params: { id: 4 } });

    expect(await response.json()).toEqual({
      data: [
        {
          event_id: 4,
          team_id: 12,
          team: {
            player1: { firstname: "Ada", lastname: "Lovelace" },
            player2: { firstname: "Grace", lastname: "Hopper" },
          },
          player1name: "Ada Lovelace",
          player2name: "Grace Hopper",
        },
      ],
    });
  });

  it("registers a team for an event", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { event_id: 4, team_id: 12 },
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
      new Request("http://localhost/api/events/4/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: 12 }),
      }),
      { params: { id: 4 } }
    );

    expect(mockInsert).toHaveBeenCalledWith({
      event_id: 4,
      team_id: 12,
    });
    expect(await response.json()).toEqual({
      data: { event_id: 4, team_id: 12 },
    });
  });

  it("returns 500 when event team registration fails", async () => {
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
      new Request("http://localhost/api/events/4/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: 12 }),
      }),
      { params: { id: 4 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Insert failed" },
    });
  });
});
