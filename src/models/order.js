import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Cart",
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

const Order = mongoose.models.Order ||mongoose.model("Order", orderSchema)
export default Order