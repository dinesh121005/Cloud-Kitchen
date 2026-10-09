import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import path from "path"

const isCloudinaryConfigured = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    return Boolean(
        cloudName &&
        !cloudName.includes("YOUR_") &&
        apiKey &&
        !apiKey.includes("YOUR_") &&
        apiSecret &&
        !apiSecret.includes("YOUR_")
    );
};

const uploadOnCloudinary = async (file) => {
    if (!file) return null;

    const fileName = path.basename(file);
    const serverUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const localUrl = `${serverUrl}/public/${fileName}`;

    // If Cloudinary keys are placeholders, immediately use local storage (0s delay)
    if (!isCloudinaryConfigured()) {
        console.log(`[Upload] Cloudinary credentials not configured; saving locally: ${localUrl}`);
        return localUrl;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        // Enforce 6-second timeout so requests never hang indefinitely
        const uploadPromise = cloudinary.uploader.upload(file, {
            folder: "mwt-food-delivery",
            resource_type: "auto"
        });

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Cloudinary request timed out")), 6000)
        );

        const result = await Promise.race([uploadPromise, timeoutPromise]);
        
        try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch (e) {}

        return result.secure_url;
    } catch (error) {
        console.warn(`[Upload] Cloudinary upload failed (${error.message}); falling back to local file: ${localUrl}`);
        // Keep the local file in /public so it can be served
        return localUrl;
    }
}

export default uploadOnCloudinary