import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.bgGrey.bold(`MongoDB connected`));
};

export default connectDB;
