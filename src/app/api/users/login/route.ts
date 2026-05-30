import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";

import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  getTokenCookieOptions,
  TOKEN_COOKIE_NAME,
} from "@/lib/auth-cookie";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();

    const { email, password } = reqBody;
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedPassword =
      typeof password === "string" ? password.trim() : "";

    if (!normalizedEmail || !trimmedPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedEmail }],
    });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 400 },
      );
    }

    const validPassword = await bcrypt.compare(
      trimmedPassword,
      user.password,
    );

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }

    //create tokendata

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    //create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response= NextResponse.json(
      { message: "Login successful"},
      { status: 200 },
    );

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      ...getTokenCookieOptions(),
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
