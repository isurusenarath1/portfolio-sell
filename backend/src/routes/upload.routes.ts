import express from 'express';
import { upload, uploadImage } from '../controllers/upload.controller';

const router = express.Router();

router.post('/', upload, uploadImage);

export default router; 