import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart.js";
import Product from "@/models/product.js";
import {connect} from "@/dbconfig/dbConfig"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {userId , productId, quantity} = reqBody;

        if(!userId || !productId || !quantity){
            return NextResponse.json({
                message: "Missing required fields",
                success: false
            }, {status: 400})
        }
        if(quantity <= 0){
            return NextResponse.json({
                message: "Quantity must be greater than 0",
                success: false
            }, {status: 400})
        }

        const[userCart , product] = await Promise.all([
            Cart.findOne({userId}),
            Product.findById(productId)
        ])
        if(!product){
            return NextResponse.json({
                message: "Item not found",
                success: false
            },{status: 404})
        }
        if(!userCart){
            //create a new cart
            const newCart = await Cart.create({
                userId,
                products: [
                    {
                        productId,
                        quantity: quantity
                    }
                ],
                totalAmount: product.price*quantity
            })
        }else{
            //existing cart needs to be updated
            const existingProduct = userCart.products.find((p: { productId: string }) => p.productId.toString() === productId)
            if(existingProduct){
                //update the quantity
                existingProduct.quantity += parseInt(quantity)
                userCart.totalAmount += product.price*quantity
            }else{
                //add new product
                userCart.products.push({
                    productId,
                    quantity: quantity
                })
                userCart.totalAmount += product.price*quantity
            }
            await userCart.save()
            
        }

        return NextResponse.json({
            message: "Item added to cart",
            success: true
        }, {status: 200})
        
        
    } catch (error:any) {
        return NextResponse.json({
            error: error.message,
            message: "Something went wrong here "
        },{status: 500})
    }
}
