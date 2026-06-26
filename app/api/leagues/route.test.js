import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { GET, POST } from "./route";

describe("app/api/leagues/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
  });

  it("returns leagues", async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: 1, league_name: "Summer League" }],
      error: null,
    });
    const supabase = {
      from: vi.fn(() => ({
        select: mockSelect,
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(supabase.from).toHaveBeenCalledWith("leagues");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(await response.json()).toEqual({
      data: [{ id: 1, league_name: "Summer League" }],
    });
  });

  it("returns a 500 response when loading leagues fails", async () => {
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Fetch failed" },
        }),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Fetch failed" },
    });
  });

  it("creates a league from a direct payload", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 7, league_name: "Autumn League" },
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
      new Request("http://localhost/api/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          league_name: "Autumn League",
          starting_date: "2026-09-01",
          midway_point: "2026-10-01",
          end_date: "2026-11-01",
        }),
      })
    );

    expect(mockInsert).toHaveBeenCalledWith({
      league_name: "Autumn League",
      starting_date: "2026-09-01",
      midway_point: "2026-10-01",
      end_date: "2026-11-01",
    });
    expect(await response.json()).toEqual({
      data: { id: 7, league_name: "Autumn League" },
    });
  });

  it("returns a 500 response when league creation fails", async () => {
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
      new Request("http://localhost/api/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          league_name: "Autumn League",
          starting_date: "2026-09-01",
          midway_point: "2026-10-01",
          end_date: "2026-11-01",
        }),
      })
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Insert failed" },
    });
  });
});


