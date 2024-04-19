import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
            .then((res) => {
                console.log(`Database connected successfully :${mongoose.connection.host}`);
            })
            .catch((err) => {
                console.log(err);
            })
    } catch (error) {
        console.log(`Error which connecting to database : ${error}`);
        process.exit(1);
    }
}