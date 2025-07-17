import {connect} from "@/dbconfig/dbConfig"
import { NextRequest, NextResponse } from "next/server"
import Admin from "@/models/admin.js"
import jwt, { JwtPayload } from "jsonwebtoken"

connect()

interface CustomJwtPayload extends JwtPayload{
    id: string;
}

export async function POST(request: NextRequest){
    try {

        const refreshToken = request.cookies.get("refreshToken")?.value;

        if(!refreshToken){
            return NextResponse.json({
                error: "You are not logged in"
            }, {status: 401})
        }
        

        const admin = await Admin.findOne({refreshToken})
        if(!admin){
            return NextResponse.json({
                error: "Admin not found"
            }, {status: 404})
        }
        admin.refreshToken = ""
        await admin.save()
        
         //clear the access token

        const response = NextResponse.json({
            message: "Logout SuccessFull",
            success: true
        }, {status: 200})
        response.cookies.set("accessToken","", {
            httpOnly: true,
            expires: new Date(0)
        })
        response.cookies.set("refreshToken","",{
            httpOnly: true,
            expires: new Date(0)
        })
        return response;
        
    } catch (error:any) {
        return NextResponse.json({
            error: `Logout Failed: ${error.message}`
        }, {status: 500})
    }
}