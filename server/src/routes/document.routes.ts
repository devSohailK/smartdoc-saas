import {Router} from 'express';
import {uplaodDocuments, getDocuments, deleteDocuments  } from '../controllers/document.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router();

router.get('/', authMiddleware, getDocuments);
router.post('/upload', authMiddleware, upload.single("file"), uplaodDocuments);
router.delete('/delete', authMiddleware, deleteDocuments);


export default router;