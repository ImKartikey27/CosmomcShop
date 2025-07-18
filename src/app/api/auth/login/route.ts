import {connect} from "@/dbconfig/dbConfig"
import Admin from "@/models/admin.js"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({
                error: "Email and password are required"
            }, { status: 400 });
        }

        //check if user exists or not
        const admin = await Admin.findOne({ email });
        if(!admin){
            return NextResponse.json({
                error: "Admin not found"
            }, {status: 404})
        }
        //check if password is correct or not 
        const validPassword = await bcrypt.compare(password, admin.password)
        if(!validPassword){
            return NextResponse.json({
                error: "Invalid Password"
            }, {status: 401})
        }
        //create access Token
        const accessToken = jwt.sign({
            id: admin._id,
            email: admin.email
        }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "15m" // Use string format
        });

        //create refresh token 
        const refreshToken = jwt.sign({
            id: admin._id,
            email: admin.email
        }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "7d" // Use string format
        });

        admin.refreshToken = refreshToken;
        await admin.save();

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        }, { status: 200 });

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60, // 15 minutes in seconds
            path: "/"
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/"
        });
        return response;
        
    } catch (error:unknown) {
        if(error instanceof Error){
            return NextResponse.json({
            error:error.message,
        },{status: 500})   
        } 
        return NextResponse.json({
            error:`Unknown Error at login route`,
        },{status: 500})
    }
}

