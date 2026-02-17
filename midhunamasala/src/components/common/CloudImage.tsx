"use client";

import { CldImage } from "next-cloudinary";

interface CloudImageProps {
    src: string; // e.g., "/images/products/IMG-20250726-WA0019.jpg"
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
    quality?: number;
}

/**
 * CloudImage - A wrapper around CldImage for optimized image delivery via Cloudinary.
 *
 * Converts local public folder paths like "/images/products/IMG-20250726-WA0019.jpg"
 * to Cloudinary public IDs.
 *
 * HOW TO FIND YOUR PUBLIC ID:
 * 1. Go to Cloudinary Dashboard -> Assets
 * 2. Click on any image
 * 3. The "Public ID" is shown in the details panel on the right
 * 4. Update the CLOUDINARY_FOLDER_PREFIX below to match your folder structure
 *
 * For example, if your Public ID shows as "products/IMG-20250726-WA0019"
 * then set CLOUDINARY_FOLDER_PREFIX = "" (empty string)
 *
 * If it shows as "midhunamasala/images/products/IMG-20250726-WA0019"
 * then set CLOUDINARY_FOLDER_PREFIX = "midhunamasala/"
 */

// ⚠️ CHANGE THIS to match your Cloudinary folder structure!
// Check the Public ID of any image in your Cloudinary dashboard.
// If images are uploaded directly (no parent folder), use ""
// If images are inside a "midhunamasala" folder, use "midhunamasala/"
const CLOUDINARY_FOLDER_PREFIX = "";

export default function CloudImage({
    src,
    alt,
    width,
    height,
    fill = false,
    sizes,
    className,
    priority = false,
    quality = 80,
}: CloudImageProps) {
    // Convert local path to Cloudinary public ID
    const publicId = convertToPublicId(src);

    // Debug: Log the public ID being used (remove in production)
    if (typeof window !== "undefined") {
        console.log(`[CloudImage] src: ${src} -> publicId: ${publicId}`);
    }

    // Build common props
    const commonProps = {
        src: publicId,
        alt,
        sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        className,
        priority,
        quality,
        format: "auto" as const,
        loading: (priority ? "eager" : "lazy") as "eager" | "lazy",
    };

    // CldImage requires width/height when fill is not used
    if (fill) {
        return <CldImage {...commonProps} fill />;
    }

    return (
        <CldImage
            {...commonProps}
            width={width || 600}
            height={height || 600}
            crop="fill"
            gravity="auto"
        />
    );
}

/**
 * Converts a local public folder path to a Cloudinary public ID.
 * Strips the leading "/" and file extension.
 *
 * Examples (with CLOUDINARY_FOLDER_PREFIX = ""):
 *  "/images/products/IMG-20250726-WA0019.jpg" -> "images/products/IMG-20250726-WA0019"
 *
 * Examples (with CLOUDINARY_FOLDER_PREFIX = "midhunamasala/"):
 *  "/images/products/IMG-20250726-WA0019.jpg" -> "midhunamasala/images/products/IMG-20250726-WA0019"
 */
function convertToPublicId(localPath: string): string {
    // Remove leading slash
    let id = localPath.startsWith("/") ? localPath.slice(1) : localPath;

    // Remove file extension
    id = id.replace(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i, "");

    // Add folder prefix if configured
    return `${CLOUDINARY_FOLDER_PREFIX}${id}`;
}
