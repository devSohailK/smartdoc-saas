import authRoutes from './auth.routes.js'
import {Router} from 'express'
import subscriptionRoutes from './subscription.routes.js'
import documentRoutes from './document.routes.js';



const router = Router()

router.use('/auth', authRoutes)
router.use('/subscription', subscriptionRoutes)
router.use('/documents', documentRoutes);




