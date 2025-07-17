import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbConfig"
import Product from "@/models/product.js";

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { category } = reqBody;
        
        const validCategories = ["coin", "rank", "crate"];
        
        if (!category) {
            return NextResponse.json({
                message: "Category is required"
            }, { status: 400 });
        }
        
        if (!validCategories.includes(category)) {
            return NextResponse.json({
                message: "Invalid category"
            }, { status: 400 });
        }

        const products = await Product.find({ category });
        
        if (products.length === 0) {
            return NextResponse.json({
                message: "No products found for this category"
            },{ status: 404 });
        }

        return NextResponse.json({
            products,
            message: "Products Fetched Successfully"
        },{ status: 200 });
        
    } catch (error: any) {
        return NextResponse.json({
            message: error.message
        },{status: 500});
    }
}