import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient } = vi.hoisted(() => ({
  mockCreateServerClient: vi.fn(),
}));

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { DELETE, PUT } from "./route";

describe("app/api/events/[id]/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
  });

  it("deletes an event by event_id", async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const supabase = {
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockEq,
        })),
      })),
    };

    mockCreateServerClient.mockReturnValue(supabase);

    const response = await DELETE(null, { params: { id: 5 } });

    expect(supabase.from).toHaveBeenCalledWith("events");
    expect(mockEq).toHaveBeenCalledWith("event_id", 5);
    expect(await response.json()).toEqual({ data: { success: true } });
  });

  it("updates an event with the expected payload", async () => {
    const mockEq = vi.fn().mockResolvedValue({
      data: [{ event_id: 5 }],
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
      new Request("http://localhost/api/events/5", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "Round 2",
          midway_matches: 3,
        }),
      }),
      { params: { id: 5 } }
    );

    expect(supabase.from).toHaveBeenCalledWith("events");
    expect(mockUpdate).toHaveBeenCalledWith({
      event_name: "Round 2",
      midway_matches: 3,
    });
    expect(mockEq).toHaveBeenCalledWith("event_id", 5);
    expect(await response.json()).toEqual({ data: [{ event_id: 5 }] });
  });

  it("returns a 500 response when the event update fails", async () => {
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
      new Request("http://localhost/api/events/5", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: "Round 2",
          midway_matches: 3,
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


