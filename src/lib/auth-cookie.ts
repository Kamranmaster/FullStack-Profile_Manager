export const TOKEN_COOKIE_NAME = "token";

/** Shared options so login and logout set/clear the same cookie. */
export function getTokenCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}
