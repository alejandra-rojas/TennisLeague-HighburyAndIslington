import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { GET, POST } from "./route";

describe("app/api/leagues/[id]/events/route", () => {
  beforeEach(() => {    mockCreateServerClient.mockReset();    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 when the league id is missing", async () => {
    const response = await GET(null, { params: {} });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { message: "Missing or invalid league id" },
    });
  });

  it("returns events for a league", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ event_id: 1, league_id: 3, event_name: "Round 1" }],
      error: null,
    });
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET(null, { params: { id: 3 } });

    expect(supabase.from).toHaveBeenCalledWith("events");
    expect(mockEq).toHaveBeenCalledWith("league_id", 3);
    expect(await response.json()).toEqual({
      data: [{ event_id: 1, league_id: 3, event_name: "Round 1" }],
    });
  });

  it("creates an event for a league", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { event_id: 7, league_id: 3, event_name: "Round 2" },
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
      new Request("http://localhost/api/leagues/3/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "Round 2",
          midway_matches: 3,
        }),
      }),
      { params: { id: 3 } }
    );

    expect(mockInsert).toHaveBeenCalledWith({
      league_id: 3,
      event_name: "Round 2",
      midway_matches: 3,
    });
    expect(await response.json()).toEqual({
      data: { event_id: 7, league_id: 3, event_name: "Round 2" },
    });
  });

  it("returns a 500 response when event creation fails", async () => {
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
      new Request("http://localhost/api/leagues/3/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "Round 2",
          midway_matches: 3,
        }),
      }),
      { params: { id: 3 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Insert failed" },
    });
  });
});


