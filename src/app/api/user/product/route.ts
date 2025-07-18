import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbConfig"
import Product from "@/models/product.js"

connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {id} = reqBody
        const product = await Product.findById(id)
        if(!product){
            return NextResponse.json({
                message: "Product not found"
            },{status: 404})
        }
        return NextResponse.json({
            product,
            message: "Product Fetched Successfully"
        },{status: 200})
        
    } catch (error:unknown) {
        if(error instanceof Error){
            return NextResponse.json({
            error:error.message,
        },{status: 500})   
        } 
        return NextResponse.json({
            error:`Unknown Error at product route`,
        },{status: 500})
    }
    
}