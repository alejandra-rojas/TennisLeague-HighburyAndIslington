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

import { GET } from "./route";

describe("app/api/events/[id]/matches/route", () => {
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

  it("returns match data for an event", async () => {
    const data = [{ match_id: 1, event_id: 8 }];
    const mockEq = vi.fn().mockResolvedValue({ data, error: null });
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await GET(null, { params: { id: 8 } });

    expect(supabase.from).toHaveBeenCalledWith("matches");
    expect(mockEq).toHaveBeenCalledWith("event_id", 8);
    expect(await response.json()).toEqual({ data });
  });

  it("returns 500 when the event matches query fails", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Query failed" },
    });
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await GET(null, { params: { id: 8 } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Query failed" },
    });
  });
});
