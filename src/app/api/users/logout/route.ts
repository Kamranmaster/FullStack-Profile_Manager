import { NextResponse } from "next/server";
import {
  getTokenCookieOptions,
  TOKEN_COOKIE_NAME,
} from "@/lib/auth-cookie";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logged out successful",
      success: true,
    });

    response.cookies.set(TOKEN_COOKIE_NAME, "", {
      ...getTokenCookieOptions(),
      expires: new Date(0),
      maxAge: 0,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
