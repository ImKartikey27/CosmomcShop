import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_DB_URI!);
        const connection = mongoose.connection;

        connection.on("connected", ()=> {
            console.log("Connected to MongoDB Successfully");
        })

        connection.on("error", (err) => {
            console.log("Error while connecting to MongoDB", err);
            process.exit()
        })
        
    } catch (error:any) {
        console.log("Something went Wrong while connection with MongoDB", error);
        
    }
}