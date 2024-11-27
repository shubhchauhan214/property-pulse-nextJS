import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: false, // Disable default body parser
    },
};

const uploadHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error parsing form' });
        }

        try {
            const imageUrls = [];

            for (const fileKey in files) {
                const file = files[fileKey];
                const result = await cloudinary.uploader.upload(file.filepath, {
                    folder: 'propertypulse', // Upload to propertypulse folder
                });
                imageUrls.push(result.secure_url);
                fs.unlinkSync(file.filepath); // Clean up temp files
            }

            const property = {
                ...fields,
                images: imageUrls,
                createdAt: new Date(),
            };

            // Save to MongoDB (example)
            // await PropertyModel.create(property);

            res.status(201).json({ message: 'Property added successfully', property });
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            res.status(500).json({ message: 'Failed to upload images' });
        }
    });
};

export default uploadHandler;
