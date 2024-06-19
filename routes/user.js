import express from "express";
import {
    loggedInUserDetails,
    anyUserDetails,
    uploadUserImg,
} from "../controllers/user.js";
import protectRoute from "../middleware/auth.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/").get(protectRoute, loggedInUserDetails);
router.route("/:id").get(protectRoute, anyUserDetails);
router.post("/image", protectRoute, upload.single("file"), uploadUserImg);

export default router;
