import express from "express";
import { loggedInUserDetails, anyUserDetails } from "../controllers/user.js";
import protectRoute from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(protectRoute, loggedInUserDetails);
router.route("/:id").get(protectRoute, anyUserDetails);

export default router;
