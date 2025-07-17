import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    refreshToken: {
        type: String
    },
    forgetPasswordToken: String, 
    forgetPasswordExpiry: Date
    

}, {timestamps: true})

adminSchema.pre("save", async function (next){
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt)
    }
    next();
})

const Admin = mongoose.models.Admin ||mongoose.model("Admin", adminSchema);

export default Admin