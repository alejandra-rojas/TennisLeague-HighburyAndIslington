import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { DELETE, PUT } from "./route";

describe("app/api/players/[id]/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
  });

  it("deletes a player successfully", async () => {
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

    const response = await DELETE(null, { params: { id: 9 } });

    expect(supabase.from).toHaveBeenCalledWith("players");
    expect(mockEq).toHaveBeenCalledWith("id", 9);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: { success: true } });
  });

  it("maps a foreign key delete error to a 400 response", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      error: { code: "23503" },
    });
    const supabase = {
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 9 } });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        message:
          "Cannot delete player. They are still referenced in one or more matches.",
        code: "23503",
      },
    });
  });

  it("maps other delete errors to a 500 response", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      error: { code: "50000" },
    });
    const supabase = {
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 9 } });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: {
        message: "An error occurred while deleting the player.",
        code: "50000",
      },
    });
  });

  it("updates a player with the expected payload", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ id: 9, firstname: "Grace", lastname: "Hopper" }],
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await PUT(
      new Request("http://localhost/api/players/9", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: "Grace",
          lastname: "Hopper",
        }),
      }),
      { params: { id: 9 } }
    );

    expect(supabase.from).toHaveBeenCalledWith("players");
    expect(mockUpdate).toHaveBeenCalledWith({
      firstname: "Grace",
      lastname: "Hopper",
    });
    expect(mockEq).toHaveBeenCalledWith("id", 9);
    expect(await response.json()).toEqual({
      data: [{ id: 9, firstname: "Grace", lastname: "Hopper" }],
    });
  });

  it("returns a 500 response when the player update fails", async () => {
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

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await PUT(
      new Request("http://localhost/api/players/9", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: "Grace",
          lastname: "Hopper",
        }),
      }),
      { params: { id: 9 } }
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: { message: "Update failed" },
    });
  });
});


