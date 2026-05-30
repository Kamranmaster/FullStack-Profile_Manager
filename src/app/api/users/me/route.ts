import { getDataFromToken } from "@/helper/getDataFromtToken";
import User from "@/Models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    try{
        await connect();

        const userID=await getDataFromToken(request);
        const user=await User.findById(userID).select("-password")

        if (!user) {
            return NextResponse.json({error:"User not found"},{status:404});
        }

        return NextResponse.json({message:"user found",
            data:user
        })
    }
    catch(error:any){
        return NextResponse.json({error:error.message},{status:400});
    }
}

