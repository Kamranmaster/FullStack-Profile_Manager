import { NextResponse,NextRequest } from "next/server";

import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import { sendEmail } from "@/helper/mailer";

export async function POST(request:NextRequest){
    try{
        await connect();
        const reqBody=await request.json();

        const { email } = reqBody;
        const normalizedEmail =
          typeof email === "string" ? email.trim().toLowerCase() : "";

        if (!normalizedEmail) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedEmail }],
        });

        if(!user){
            return NextResponse.json({error:"User not found"},{status:400});
        }

        await sendEmail({email:user.email,emailType:"RESET",userId:user._id});

        return NextResponse.json({message:"Password reset link sent to your email",success:true},{status:200});
    }catch(error:any){
        return NextResponse.json({error:error.message},{status:400});
    }
}
