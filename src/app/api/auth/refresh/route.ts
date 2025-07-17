import {connect} from "@/dbconfig/dbConfig"
import Admin from "@/models/admin.js"
import jwt, { JwtPayload } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

interface CustomJwtPayload extends JwtPayload{
    id: string
}

connect()

export async function POST(request: NextRequest){
    try {
        const refreshToken = request.cookies.get("refreshToken")?.value;
        if(!refreshToken){
            return NextResponse.json({
                message: "You are not logged in"
            },{status: 401})
        }
        //verify the refresh token 
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as CustomJwtPayload
        if(!decoded){
            return NextResponse.json({
                message: "Invalid refresh token"
            },{status: 401})
        }
        //find the admin in the database
        const admin = await Admin.findById(decoded.id)
        if(!admin){
            return NextResponse.json({
                message: "Admin not found"
            },{status: 404})
        }
        //create new access token 
        const accessToken = jwt.sign({
            id: admin._id,
            email: admin.email
        }, process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: "15m"})

        //create a new refresh token 
        const newRefreshToken = jwt.sign({
            id: admin._id,
            email: admin.email
        }, process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: "7d"})

        admin.refreshToken = newRefreshToken
        await admin.save()

        const response = NextResponse.json({
            message: "Token Refreshed Successfully",
            success: true,
        },{status: 200})
        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15*60
        })
        response.cookies.set("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: 7*24*60*60
        })
        return response;
        
    } catch (error:any) {
        return NextResponse.json({
            error: error.message
        }, {status: 500})
    }
}