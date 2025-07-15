import {connect} from "@/dbconfig/dbConfig"
import Admin from "@/models/admin.js"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        //check if user exists or not
        const admin = await Admin.findOne({email})
        if(!admin){
            return NextResponse.json({
                error: "Admin not found",
                status: 404
            })
        }
        //check if password is correct or not 
        const validPassword = await bcrypt.compare(password, admin.password)
        if(!validPassword){
            return NextResponse.json({
                error: "Invalid Password",
                status: 401
            })
        }
        //create access Token
        const accessToken = jwt.sign({
            id: admin._id,
            email: admin.email
        },process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY!)}
        )
        //create refresh token 
        const refreshToken = jwt.sign({
            id: admin._id,
            email: admin.email
        },process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY!)}
    )
    admin.refreshToken = refreshToken
    await admin.save();
    const response = NextResponse.json({
        message: "Login successful",
        success: true,
    })
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
    })
    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true
    })
    return response;
        
    } catch (error:any) {
        return NextResponse.json({
            error:error.message,
            status:500
        })
    }
}

