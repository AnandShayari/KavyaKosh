import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';

if (config.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export const uploadToCloudinary = (fileBuffer, folder = 'kavyakosh') =>
  new Promise((resolve, reject) => {
    if (!config.cloudinary.cloudName) {
      return resolve({ url: `https://picsum.photos/seed/${Date.now()}/800/600` });
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });

export const deleteFromCloudinary = async (publicId) => {
  if (config.cloudinary.cloudName && publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};
