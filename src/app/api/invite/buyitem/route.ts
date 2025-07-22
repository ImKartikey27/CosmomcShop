import { NextRequest, NextResponse } from "next/server";
import Invite from "@/models/invite.js";
import Cart from "@/models/cart.js";
import User from "@/models/user.js";
import Order from "@/models/order.js";
import { connect } from "@/dbconfig/dbConfig";

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {userId, discordId } = reqBody
        if(!userId || !discordId){
            return NextResponse.json({
                message: "Missing required fields",
                success: false
            }, {status: 400})
        }
        
        

        const [invite, cart, user] = await Promise.all([
            Invite.findOne({"inviter.username": discordId}),
            Cart.findOne({userId}),
            User.findById(userId)
        ])
        
        if(!invite){
            return NextResponse.json({
                message: "Invite not found",
                success: false
            }, {status: 404})
        }

        
        if(!cart){
            return NextResponse.json({
                message: "Cart not found",
                success: false
            }, {status: 404})
        }
        if(!user){
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {status: 404})
        }
        
        if(invite.invites >= cart.totalAmount){
            invite.invites -= cart.totalAmount
            //create a order
            const order = await Order.create({
                userId,
                cart: cart._id,
                status: "pending"
            })
            await cart.deleteOne({userId})
            //send to the plugin 
            if(true){
                order.status = "success"
            }else{
                order.status = "failed"
            }
            await order.save()
            user.transactionHistory.push(order._id)
            await invite.save()
            await user.save()
            return NextResponse.json({
                message: "Order created successfully",
                success: true
            }, {status: 201})

        }else{
            //delete the cart
            cart.deleteOne({userId})
            return NextResponse.json({
                message: "Not enough invites",
                success: false
            }, {status: 400})
        }



        
        

        
    } catch (error:unknown) {
        return NextResponse.json({
            error: error,
            message: "Something went wrong"
        }, {status: 500})
    }
}
