import { sendMessage, getChatHistory } from "../controllers/chat.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware); // used in all routes

router.post('/message', sendMessage);
router.get('/:docId', getChatHistory);

export default router;