import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            price:{
                type: Number,
                required: true
            }
        }
    ],
    totalAmount:{
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    date: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})

const Order = mongoose.model("Order", orderSchema)
export default Order