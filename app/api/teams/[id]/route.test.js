import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { DELETE } from "./route";

describe("app/api/teams/[id]/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 12 } });

    expect(supabase.from).toHaveBeenCalledWith("teams");
    expect(mockEq).toHaveBeenCalledWith("team_id", 12);
    expect(await response.json()).toEqual({ data: { success: true } });
  });
});


