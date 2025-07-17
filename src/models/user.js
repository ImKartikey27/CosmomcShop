import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    transactionHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    token: {
        type: String
    }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User;