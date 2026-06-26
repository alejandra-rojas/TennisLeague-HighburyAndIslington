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

import { DELETE, PUT } from "./route";

describe("app/api/leagues/[id]/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
  });

  it("deletes a league by id", async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const supabase = {
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 5 } });

    expect(supabase.from).toHaveBeenCalledWith("leagues");
    expect(mockEq).toHaveBeenCalledWith("id", 5);
    expect(await response.json()).toEqual({ data: { success: true } });
  });

  it("returns a 500 response when league deletion fails", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      error: { message: "Delete failed" },
    });
    const supabase = {
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 5 } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Delete failed" },
    });
  });

  it("updates a league from a direct payload", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ id: 5 }],
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
      new Request("http://localhost/api/leagues/5", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          league_name: "Autumn League",
          starting_date: "2026-09-01",
          midway_point: "2026-10-01",
          end_date: "2026-11-01",
          isfinished: true,
        }),
      }),
      { params: { id: 5 } }
    );

    expect(supabase.from).toHaveBeenCalledWith("leagues");
    expect(mockUpdate).toHaveBeenCalledWith({
      league_name: "Autumn League",
      starting_date: "2026-09-01",
      midway_point: "2026-10-01",
      end_date: "2026-11-01",
      isfinished: true,
    });
    expect(mockEq).toHaveBeenCalledWith("id", 5);
    expect(await response.json()).toEqual({ data: [{ id: 5 }] });
  });

  it("returns a 500 response when the league update fails", async () => {
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
      new Request("http://localhost/api/leagues/5", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          league_name: "Autumn League",
          starting_date: "2026-09-01",
          midway_point: "2026-10-01",
          end_date: "2026-11-01",
          isfinished: true,
        }),
      }),
      { params: { id: 5 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Update failed" },
    });
  });
});
