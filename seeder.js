import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
import { Feedback } from "./models/Feedback.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const feedbacks = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/feedbacks.json`, "utf-8")
);

// Import into DB
const importData = async () => {
    try {
        await Feedback.create(feedbacks);
        console.log(chalk.bgGreen.bold("Data Imported..."));
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Feedback.deleteMany();
        console.log(chalk.bgRed.bold("Data Destroyed..."));
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}
