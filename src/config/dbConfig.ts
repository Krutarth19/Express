import mongoose from "mongoose";
import { config } from "../types/default";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.DATABASE)
            .then((res) => {
                console.log(`Database connected successfully :${mongoose.connection.host}`);
            })
            .catch((err) => {
                console.log(err);
            })
    } catch (error) {
        console.log(`Error in connecting to database : ${error}`);
        process.exit(1);
    }
}