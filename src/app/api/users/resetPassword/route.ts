import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { token, password } = await request.json();
    const trimmedPassword =
      typeof password === "string" ? password.trim() : "";

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 },
      );
    }

    if (!trimmedPassword) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswodExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { password: hashedPassword },
        $unset: { forgotPasswordToken: 1, forgotPasswodExpiry: 1 },
      },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      trimmedPassword,
      updatedUser.password,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Failed to save new password" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
