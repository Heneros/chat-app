import dotenv from 'dotenv';
import {
    v2 as cloudinary,
    UploadApiResponse,
    UploadApiErrorResponse,
} from 'cloudinary';
import path from 'path';
import streamfier from 'streamifier';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUploader = async function uploadToCloudinary(
    fileBuffer: Buffer,
    originalName: string,
): Promise<{ url: string } | undefined> {
    try {
        const mainFolderName = 'chatApp';
        const fileName = path.parse(originalName).name;
        const uniqueFileName = `${fileName}_${Date.now()}`;

        const filePathOnCloudinary = `${mainFolderName}/${uniqueFileName};`;
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    public_id: filePathOnCloudinary,
                    resource_type: 'auto',
                    fetch_format: 'auto',
                    quality: 'auto:eco',
                    crop: 'limit',
                },
                (
                    err: UploadApiErrorResponse | undefined,
                    result: UploadApiResponse | undefined,
                ) => {
                    if (err) {
                        console.error('Cloudinary upload error:', err);
                        reject(err);
                    } else if (result && result.secure_url) {
                        resolve({ url: result.secure_url });
                    } else {
                        reject(
                            new Error(
                                'Failed to get secure_url from Cloudinary response',
                            ),
                        );
                    }
                },
            );
            streamfier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    } catch (error) {
        console.error('Error in uploadToCloudinary:', error);
    }
};
