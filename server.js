import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.js";
import feedbacks from "./routes/feedbacks.js";

// Load env variables
dotenv.config({ path: "./config/config.env" });

//Connect to Database
connectDB();

// Initialize Express
const app = express();

// Body parser
app.use(express.json());

//Mount routers
app.use("/feedbacks", feedbacks);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(
        chalk.bgCyan.bold(
            `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
        )
    );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(chalk.red.bold(`Error: ${err.message}`));
    // Close server & exit process
    // server.close(() => process.exit(1));
});
