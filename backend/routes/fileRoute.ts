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
            if (result) {
                res.json({ image: result.url });

                //   res.json({ image: result.url });
                ///     res.send(result.url);
            } else {
                res.status(500).send('Failed to upload image.');
            }
            // if (result && result.url) res.json({ image: result.url });
            //  res.send(result.url);
        } catch (err) {
            console.error('Error uploading to Cloudinary:', err);
            res.status(500).send('Error uploading file');
        }
    });

export default router;
