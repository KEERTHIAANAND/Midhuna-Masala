/**
 * One-time script to upload all images to Cloudinary with correct public IDs.
 *
 * INSTRUCTIONS:
 * 1. Go to Cloudinary Dashboard → Settings → API Keys
 * 2. Copy your API Key and API Secret
 * 3. Update the CLOUD_NAME, API_KEY, and API_SECRET below
 * 4. Run: node scripts/upload-to-cloudinary.mjs
 * 5. After successful upload, you can delete the old images from Cloudinary Media Library
 */

import { v2 as cloudinary } from "cloudinary";
import { readdirSync, statSync } from "fs";
import { join, relative, parse } from "path";

// ⚠️ UPDATE THESE VALUES from your Cloudinary Dashboard → Settings → API Keys
const CLOUD_NAME = "dstspf8bo";
const API_KEY = "YOUR_API_KEY_HERE";       // ← Get from Cloudinary Dashboard
const API_SECRET = "YOUR_API_SECRET_HERE"; // ← Get from Cloudinary Dashboard

// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

// Path to your public/images folder
const IMAGE_DIR = join(process.cwd(), "public", "images");

// Supported image extensions
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"];

/**
 * Recursively find all image files in a directory
 */
function findImages(dir) {
    const results = [];
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            results.push(...findImages(fullPath));
        } else {
            const { ext } = parse(item);
            if (IMAGE_EXTENSIONS.includes(ext.toLowerCase())) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

/**
 * Convert file path to Cloudinary public ID
 * e.g., "public/images/products/IMG-20250726-WA0019.jpg"
 *    → "images/products/IMG-20250726-WA0019"
 */
function toPublicId(filePath) {
    const rel = relative(join(process.cwd(), "public"), filePath);
    const { dir, name } = parse(rel);
    // Use forward slashes for Cloudinary
    const folder = dir.replace(/\\/g, "/");
    return `${folder}/${name}`;
}

async function main() {
    console.log("🔍 Scanning for images in:", IMAGE_DIR);

    const images = findImages(IMAGE_DIR);
    console.log(`📸 Found ${images.length} images to upload\n`);

    let success = 0;
    let failed = 0;

    for (const imagePath of images) {
        const publicId = toPublicId(imagePath);

        try {
            console.log(`⬆️  Uploading: ${publicId}`);

            const result = await cloudinary.uploader.upload(imagePath, {
                public_id: publicId,
                overwrite: true,
                resource_type: "image",
                use_filename: false,      // Use our custom public_id, not the filename
                unique_filename: false,   // Don't append random suffix
            });

            console.log(`   ✅ Done → ${result.secure_url}\n`);
            success++;
        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}\n`);
            failed++;
        }
    }

    console.log("═".repeat(50));
    console.log(`\n🎉 Upload complete!`);
    console.log(`   ✅ Success: ${success}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n💡 You can now delete the old auto-named images from your Cloudinary Media Library.`);
    console.log(`   Your images are now accessible with public IDs like:`);
    console.log(`   • images/products/IMG-20250726-WA0019`);
    console.log(`   • images/banners/banner3`);
}

main().catch(console.error);
