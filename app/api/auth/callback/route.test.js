import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateServerClient, mockExchangeCodeForSession } = vi.hoisted(
  () => ({
    mockCreateServerClient: vi.fn(),
    mockExchangeCodeForSession: vi.fn(),
  })
);

vi.mock("@/supabase/server", () => ({
  createClient: mockCreateServerClient,
}));

import { GET } from "./route";

describe("app/api/auth/callback/route", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReset();
    mockExchangeCodeForSession.mockReset();
  });

  it("exchanges the auth code and redirects to the app origin", async () => {
    mockCreateServerClient.mockReturnValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession.mockResolvedValue({}),
      },
    });

    const response = await GET(
      new Request("http://localhost/api/auth/callback?code=auth-code")
    );

    expect(mockCreateServerClient).toHaveBeenCalledTimes(1);
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("auth-code");

    const location = new URL(response.headers.get("location"));

    expect(response.status).toBe(307);
    expect(location.origin).toBe("http://localhost");
    expect(location.pathname).toBe("/");
  });

  it("redirects even when no auth code is present", async () => {
    const response = await GET(new Request("http://localhost/api/auth/callback"));

    expect(mockCreateServerClient).not.toHaveBeenCalled();

    const location = new URL(response.headers.get("location"));

    expect(response.status).toBe(307);
    expect(location.origin).toBe("http://localhost");
    expect(location.pathname).toBe("/");
  });
});
