export function applySaturation(imageData: ImageData, saturationValue: number = 1.0): ImageData {
	// Create a copy of the image data to avoid modifying the original
	const width = imageData.width;
	const height = imageData.height;
	const output = new ImageData(width, height);

	// Copy the original pixels
	const inputData = imageData.data;
	const outputData = output.data;

	// For each pixel in the image
	for (let i = 0; i < inputData.length; i += 4) {
		// Get RGB values
		const r = inputData[i];
		const g = inputData[i + 1];
		const b = inputData[i + 2];
		const a = inputData[i + 3];

		// Calculate grayscale value (luminance)
		const gray = 0.299 * r + 0.587 * g + 0.114 * b;

		// Apply saturation adjustment
		// saturationValue = 0 gives grayscale, 1 = original, >1 increases saturation
		const newR = Math.min(255, Math.max(0, gray + (r - gray) * saturationValue));
		const newG = Math.min(255, Math.max(0, gray + (g - gray) * saturationValue));
		const newB = Math.min(255, Math.max(0, gray + (b - gray) * saturationValue));

		// Set output pixel
		outputData[i] = Math.round(newR);
		outputData[i + 1] = Math.round(newG);
		outputData[i + 2] = Math.round(newB);
		outputData[i + 3] = a; // Keep original alpha
	}

	return output;
}

// Reuse the utility functions from floydSteinberg's
export { getImageDataFromImage, createImageUrlFromImageData } from './floydSteinberg';
