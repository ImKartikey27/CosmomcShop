import User from "@/models/user.js"
import { NextRequest, NextResponse } from "next/server"
import {connect} from "@/dbconfig/dbConfig"
import jwt from "jsonwebtoken"

connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const { username } = reqBody;

        // Validate username
        if (!username) {
            return NextResponse.json({
                message: "Username is required",
                status: 400
            });
        }

        let user = await User.findOne({ username });
        if (!user) {
            // Create new user 
            user = await User.create({ username });
        }

        // Generate the token
        const tokenData = {
            id: user._id,
            username: user.username
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "24h"
        });

        user.token = token;
        await user.save();

        const response = NextResponse.json({
            message: "Login Successful",
            success: true
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: parseInt(process.env.TOKEN_EXPIRY!),
        });
        return response;
        
    } catch (error:any) {

        return NextResponse.json({
            message: error.message,
            status: 500
        })
        
    }
}