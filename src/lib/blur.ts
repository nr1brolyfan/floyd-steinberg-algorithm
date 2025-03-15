export function applyBlur(imageData: ImageData, radius: number = 5): ImageData {
	// Create a copy of the image data to avoid modifying the original
	const width = imageData.width;
	const height = imageData.height;
	const output = new ImageData(width, height);

	// Copy the original pixels
	const inputData = imageData.data;
	const outputData = output.data;

	// Apply Gaussian blur
	const radiusSquared = radius * radius;
	const sigma = radius / 2;
	const sigmaSq2 = 2 * sigma * sigma;
	const sigmaSqPi2 = Math.PI * sigmaSq2;

	// For each pixel in the image
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let r = 0,
				g = 0,
				b = 0,
				a = 0;
			let weightSum = 0;

			// For each kernel element
			for (let ky = -radius; ky <= radius; ky++) {
				for (let kx = -radius; kx <= radius; kx++) {
					const distSq = kx * kx + ky * ky;

					// Skip if outside radius
					if (distSq > radiusSquared) continue;

					// Calculate Gaussian weight
					const weight = Math.exp(-distSq / sigmaSq2) / sigmaSqPi2;

					// Get neighboring pixel
					const nx = Math.min(width - 1, Math.max(0, x + kx));
					const ny = Math.min(height - 1, Math.max(0, y + ky));
					const idx = (ny * width + nx) * 4;

					// Accumulate weighted values
					r += inputData[idx] * weight;
					g += inputData[idx + 1] * weight;
					b += inputData[idx + 2] * weight;
					a += inputData[idx + 3] * weight;
					weightSum += weight;
				}
			}

			// Set output pixel
			const outIdx = (y * width + x) * 4;
			outputData[outIdx] = Math.round(r / weightSum);
			outputData[outIdx + 1] = Math.round(g / weightSum);
			outputData[outIdx + 2] = Math.round(b / weightSum);
			outputData[outIdx + 3] = Math.round(a / weightSum);
		}
	}

	return output;
}

// Reuse the utility functions from floydSteinberg
export { getImageDataFromImage, createImageUrlFromImageData } from './floydSteinberg';
