import { NextRequest,NextResponse } from "next/server";
import Admin from "@/models/admin.js";
import {connect} from "@/dbconfig/dbConfig"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { name, email, password } = reqBody;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json({
                message: "Name, email, and password are required"
            }, { status: 400 });
        }

        // Check if admin already exists
        const admin = await Admin.findOne({ email });
        if (admin) {
            return NextResponse.json({
                message: "Admin already exists"
            }, { status: 400 });
        }

        const newAdmin = new Admin({
            name,
            email,
            password 
        });

        const savedAdmin = await newAdmin.save();

        // Generate tokens
        const tokenData = {
            id: savedAdmin._id,
            email: savedAdmin.email
        };

        // Generate access token
        const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "15m" 
        });

        // Generate refresh token
        const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "7d"
        });

        savedAdmin.refreshToken = refreshToken;
        await savedAdmin.save();

        const response = NextResponse.json({
            message: "Admin created successfully",
            success: true
        }, { status: 201 });


        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60
        });
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60
        });

        return response;

        
    } catch (error:any) {

        return NextResponse.json({
            message: error.message
        },{status: 500})
        
    }
}