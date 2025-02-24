import imageCompression from 'browser-image-compression';

// Service for compressing file with optional width and height
export const compressImageFileService = async (file, width, height) => {
    const targetSizeKB = 500; // 500 KB target
    const maxIterations = 10; // Maximum compression iterations
    const minQuality = 0.1; // Minimum acceptable quality
    const initialQuality = 0.8; // Starting quality

    let compressedFile = file;
    let fileSizeKB = compressedFile.size / 1024; // Initial file size in KB
    let quality = initialQuality;

    // If width and height are provided, use them, otherwise calculate from image
    let originalWidth, originalHeight;

    if (width && height) {
        originalWidth = width;
        originalHeight = height;
    } else {
        // Create an image element to get original dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);

        try {
            // Wait for the image to load
            await new Promise((resolve) => (img.onload = resolve));
            originalWidth = img.width;
            originalHeight = img.height;
        } catch (error) {
            throw new Error("Image compression failed: Unable to load image dimensions.");
        }
    }

    let maxWidthOrHeight = Math.max(originalWidth, originalHeight); // Use the largest dimension

    for (let i = 0; i < maxIterations; i++) {
        // Compress the image
        compressedFile = await imageCompression(compressedFile, {
            maxSizeMB: fileSizeKB / 1024,
            initialQuality: quality,
            maxWidthOrHeight: maxWidthOrHeight,
            useWebWorker: true,
        });

        // Update the current file size in KB
        fileSizeKB = compressedFile.size / 1024;

        // Exit loop if the file is under the target size
        if (fileSizeKB <= targetSizeKB) break;

        // Reduce quality and dimensions for next iteration
        quality = Math.max(minQuality, quality - 0.1);
        maxWidthOrHeight = Math.max(800, maxWidthOrHeight * 0.8); // Reduce dimensions gradually
    }

    const compressedImageURL = URL.createObjectURL(compressedFile);
    return { compressedFile, compressedImageURL };
};

// Service for compressing blob or file with optional width and height
export const compressImageBlobService = async (blobOrFile, width, height) => {
    // Convert Blob to File if needed
    const file = blobOrFile instanceof Blob
        ? new File([blobOrFile], 'compressed_image.jpg', { type: blobOrFile.type })
        : blobOrFile;

    const targetSizeKB = 500; // 500 KB target size
    const maxIterations = 10; // Maximum compression attempts
    const minQuality = 0.1; // Minimum allowable quality
    const initialQuality = 0.8; // Initial compression quality

    let compressedFile = file;
    let fileSizeKB = compressedFile.size / 1024; // Initial file size in KB
    let quality = initialQuality;

    // If width and height are provided, use them, otherwise calculate from image
    let originalWidth, originalHeight;

    if (width && height) {
        originalWidth = width;
        originalHeight = height;
    } else {
        // Create an image element to fetch dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);

        try {
            // Wait for the image to load to get original dimensions
            await new Promise((resolve) => (img.onload = resolve));
            originalWidth = img.width;
            originalHeight = img.height;
        } catch (error) {
            throw new Error("Image compression failed: Unable to load image dimensions.");
        }
    }

    let maxWidthOrHeight = Math.max(originalWidth, originalHeight); // Use larger dimension

    for (let i = 0; i < maxIterations; i++) {
        // Compress the image
        compressedFile = await imageCompression(compressedFile, {
            maxSizeMB: fileSizeKB / 1024, // Target size in MB
            initialQuality: quality, // Adjust quality dynamically
            maxWidthOrHeight: maxWidthOrHeight, // Adjust dimensions dynamically
            useWebWorker: true, // Use Web Workers for efficiency
        });

        // Update the file size after compression
        fileSizeKB = compressedFile.size / 1024;

        // Exit loop if the compressed size is within the target
        if (fileSizeKB <= targetSizeKB) {
            return compressedFile;
        }

        // Adjust quality and dimensions for the next iteration
        quality = Math.max(minQuality, quality - 0.1); // Lower quality each iteration
        maxWidthOrHeight = Math.max(800, maxWidthOrHeight * 0.8); // Reduce dimensions by 20%
    }

    console.warn('Maximum compression attempts reached.');
    return compressedFile;
};

// Service for getting site's icon
export const getIcon = (url) => {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;

    let hostname = new URL(formattedUrl).hostname;
    hostname = hostname.replace('www.', '');
    return `https://logo.clearbit.com/https://${hostname}`;
}
