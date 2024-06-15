import express from "express";
import protectRoute from "../middleware/auth.js";
import {
    getFeedback,
    getFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
} from "../controllers/feedbacks.js";
import {
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

router.route("/").get(getFeedbacks).post(addFeedback);

router
    .route("/:id")
    .get(getFeedback)
    .put(updateFeedback)
    .delete(deleteFeedback);

// Params: Feedback id
router.route("/comment/:id").post(addComment);

// Params: Comment id
router.route("/comment/:id").put(updateComment).delete(deleteComment);

// router
//     .route("/reply/:id")
//     .post(postReply)
//     .put(updateReply)
//     .delete(deleteReply);
export default router;
