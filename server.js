import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import errorHandler from "./middleware/error.js";
import feedbacks from "./routes/feedbacks.js";
import auth from "./routes/auth.js";
import user from "./routes/user.js";

// Load env variables
dotenv.config({ path: "./config/config.env" });

//Connect to Database
connectDB();

// Initialize Express
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//Mount routers
app.use("/feedbacks", feedbacks);
app.use("/auth", auth);
app.use("/user", user);

// Error Handler
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
