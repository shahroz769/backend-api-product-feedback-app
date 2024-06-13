import express from "express";
import {
    getFeedback,
    getFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
} from "../controllers/feedbacks.js";

const router = express.Router();

router.route("/").get(getFeedbacks).post(addFeedback);

router
    .route("/:id")
    .get(getFeedback)
    .put(updateFeedback)
    .delete(deleteFeedback);

export default router;
