import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.memoryStorage();

function checkImageType(file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|gif|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Unsupported file format. You can only upload jpeg, jpg, png or gif',
            ),
        );
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback,
    ) => {
        checkImageType(file, cb);
    },
});

export default upload;
