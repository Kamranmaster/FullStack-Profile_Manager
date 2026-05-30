import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";

import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    const normalizedUsername =
      typeof username === "string" ? username.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedPassword =
      typeof password === "string" ? password.trim() : "";

    if (!normalizedUsername || !normalizedEmail || !trimmedPassword) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    const userName = await User.findOne({ username: normalizedUsername });
    const Email = await User.findOne({ email: normalizedEmail });
    

    if (userName) {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 400 },
      );
    }
    if (Email) {
      return NextResponse.json(
        { error: "User with this email address already exists" },
        { status: 400 },
      );
    }
    

    const salt= await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser=await newUser.save()


    console.log(savedUser)

    //send verification Email

    await sendEmail({
      email: normalizedEmail,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
        message:"User created succesfully",
        success:true,
        savedUser
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }


}
