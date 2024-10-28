import express, { Request, Response } from 'express';

import { cloudinaryUploader } from '../config/cloudinary';
import upload from '../controllers/file/file';

const router = express.Router();

router
    .route('/')
    .patch(upload.single('imageUrl'), async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).send('No file uploaded.');
            }
            const result = await cloudinaryUploader(
                req.file.buffer,
                req.file.originalname,
            );
            res.send(result);
        } catch (err) {
            console.error('Error uploading to Cloudinary:', err);
            res.status(500).send('Error uploading file');
        }
    });

export default router;
