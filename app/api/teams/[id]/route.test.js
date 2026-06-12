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

import { DELETE } from "./route";

describe("app/api/teams/[id]/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockCookies.mockReturnValue("cookie-store");
  });

  it("deletes a team by team_id", async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn(() => ({
      eq: mockEq,
    }));
    const supabase = {
      from: vi.fn(() => ({
        delete: mockDelete,
      })),
    };

    mockCreateRouteHandlerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 12 } });

    expect(supabase.from).toHaveBeenCalledWith("teams");
    expect(mockEq).toHaveBeenCalledWith("team_id", 12);
    expect(await response.json()).toEqual({ data: { success: true } });
  });
});
