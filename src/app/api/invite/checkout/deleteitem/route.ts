import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cart.js";
import Product from "@/models/product.js";
import { connect } from "@/dbconfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { userId, productId, quantity } = reqBody;

        if (!userId || !productId) {
            return NextResponse.json({
                message: "Missing required fields (userId and productId)",
                success: false
            }, { status: 400 });
        }

        const [userCart, product] = await Promise.all([
            Cart.findOne({ userId }),
            Product.findById(productId)
        ]);

        if (!product) {
            return NextResponse.json({
                message: "Product not found",
                success: false
            }, { status: 404 });
        }

        if (!userCart) {
            return NextResponse.json({
                message: "Cart not found for this user",
                success: false
            }, { status: 404 });
        }

        const existingProduct = userCart.products.find(
            (p: { productId: string }) => p.productId.toString() === productId
        );

        if (!existingProduct) {
            return NextResponse.json({
                message: "Product not found in cart",
                success: false
            }, { status: 404 });
        }

        if (quantity && quantity > 0) {
            // Decrease quantity by specified amount
            if (existingProduct.quantity <= quantity) {
                // Remove the product entirely if quantity to remove >= current quantity
                userCart.products = userCart.products.filter(
                    (p: { productId: string }) => p.productId.toString() !== productId
                );
                userCart.totalAmount -= product.price * existingProduct.quantity;
            } else {
                // Decrease the quantity
                existingProduct.quantity -= quantity;
                userCart.totalAmount -= product.price * quantity;
            }
        } else {
            // Remove the entire product from cart (if no quantity specified)
            userCart.products = userCart.products.filter(
                (p: { productId: string }) => p.productId.toString() !== productId
            );
            userCart.totalAmount -= product.price * existingProduct.quantity;
        }

        // Ensure totalAmount doesn't go below 0
        userCart.totalAmount = Math.max(0, userCart.totalAmount);

        // If cart is empty, you can either delete the cart or keep it with empty products
        await userCart.save();

        if (userCart.products.length === 0) {
            //delete the cart in that case
            await Cart.deleteOne({ userId });
        }

        

        return NextResponse.json({
            message: "Item removed from cart successfully",
            success: true,
            cart: {
                products: userCart.products,
                totalAmount: userCart.totalAmount
            }
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json({
            error: error,
            message: "Something went wrong while removing item from cart"
        }, { status: 500 });
    }
}