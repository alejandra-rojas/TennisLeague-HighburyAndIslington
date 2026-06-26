import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCookies,
  mockCreateRouteHandlerClient,
  mockExchangeCodeForSession,
} = vi.hoisted(() => ({
  mockCookies: vi.fn(),
  mockCreateRouteHandlerClient: vi.fn(),
  mockExchangeCodeForSession: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mockCookies,
}));

vi.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: mockCreateRouteHandlerClient,
}));

import { GET } from "./route";

describe("app/api/auth/callback/route", () => {
  beforeEach(() => {
    mockCookies.mockReset();
    mockCreateRouteHandlerClient.mockReset();
    mockExchangeCodeForSession.mockReset();
    mockCookies.mockReturnValue("cookie-store");
  });

  it("exchanges the auth code and redirects to the app origin", async () => {
    mockCreateRouteHandlerClient.mockReturnValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession.mockResolvedValue({}),
      },
    });

    const response = await GET(
      new Request("http://localhost/api/auth/callback?code=auth-code")
    );

    expect(mockCreateRouteHandlerClient).toHaveBeenCalledWith({
      cookies: mockCookies,
    });
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("auth-code");

    const location = new URL(response.headers.get("location"));

    expect(response.status).toBe(307);
    expect(location.origin).toBe("http://localhost");
    expect(location.pathname).toBe("/");
  });

  it("redirects even when no auth code is present", async () => {
    const response = await GET(new Request("http://localhost/api/auth/callback"));

    expect(mockCreateRouteHandlerClient).not.toHaveBeenCalled();

    const location = new URL(response.headers.get("location"));

    expect(response.status).toBe(307);
    expect(location.origin).toBe("http://localhost");
    expect(location.pathname).toBe("/");
  });
});
