import {Router} from 'express';
import {uplaodDocuments, getDocuments, deleteDocuments  } from '../controllers/document.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router();

router.use(authMiddleware); // used in all routes

router.get('/', getDocuments);
router.post('/upload', upload.single("file"), uplaodDocuments);
router.delete('/:id', deleteDocuments);


export default router;