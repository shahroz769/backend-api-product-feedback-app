import express from "express";
import { register, login, logout } from "../controllers/auth.js";
import protectRoute from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.post("/logout", protectRoute, logout);

export default router;
