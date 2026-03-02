import { upgradeToPro } from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {Router} from 'express'


const router = Router()

router.patch('/upgrade', authMiddleware, upgradeToPro)

export default router;