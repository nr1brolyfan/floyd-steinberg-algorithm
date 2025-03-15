export function applyFloydSteinberg(imageData: ImageData, threshold: number = 128): ImageData {
	// Create a copy of the image data to avoid modifying the original
	const width = imageData.width;
	const height = imageData.height;
	const output = new ImageData(width, height);

	// Copy the original pixels
	const inputPixels = new Uint32Array(imageData.data.buffer);
	const outputPixels = new Uint32Array(output.data.buffer);
	const pixelData = new Float32Array(width * height * 3); // RGB values -> floats

	// Extracting RGB values
	for (let i = 0; i < inputPixels.length; i++) {
		const pixel = inputPixels[i];
		const r = (pixel >> 16) & 0xff;
		const g = (pixel >> 8) & 0xff;
		const b = pixel & 0xff;

		pixelData[i * 3] = r;
		pixelData[i * 3 + 1] = g;
		pixelData[i * 3 + 2] = b;
	}

	// Apply Floyd-Steinberg dithering
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const idx = (y * width + x) * 3;

			// Get current pixel values
			const r = Math.min(255, Math.max(0, pixelData[idx]));
			const g = Math.min(255, Math.max(0, pixelData[idx + 1]));
			const b = Math.min(255, Math.max(0, pixelData[idx + 2]));

			// Calculate grayscale value
			const gray = 0.299 * r + 0.587 * g + 0.114 * b;

			// Determine new pixel value (black or white)
			const newPixel = gray < threshold ? 0 : 255;

			// Calculate quantization error
			const errorR = r - newPixel;
			const errorG = g - newPixel;
			const errorB = b - newPixel;

			// Set the output pixel
			outputPixels[y * width + x] =
				0xff000000 | // Alpha
				(newPixel << 16) | // R
				(newPixel << 8) | // G
				newPixel; // B

			// Distribute error to neighboring pixels using Floyd-Steinberg algorithm
			// Right pixel (7/16)
			if (x + 1 < width) {
				pixelData[idx + 3] += (errorR * 7) / 16;
				pixelData[idx + 4] += (errorG * 7) / 16;
				pixelData[idx + 5] += (errorB * 7) / 16;
			}

			// Bottom-left pixel (3/16)
			if (y + 1 < height && x - 1 >= 0) {
				pixelData[idx + width * 3 - 3] += (errorR * 3) / 16;
				pixelData[idx + width * 3 - 2] += (errorG * 3) / 16;
				pixelData[idx + width * 3 - 1] += (errorB * 3) / 16;
			}

			// Bottom pixel (5/16)
			if (y + 1 < height) {
				pixelData[idx + width * 3] += (errorR * 5) / 16;
				pixelData[idx + width * 3 + 1] += (errorG * 5) / 16;
				pixelData[idx + width * 3 + 2] += (errorB * 5) / 16;
			}

			// Bottom-right pixel (1/16)
			if (y + 1 < height && x + 1 < width) {
				pixelData[idx + width * 3 + 3] += (errorR * 1) / 16;
				pixelData[idx + width * 3 + 4] += (errorG * 1) / 16;
				pixelData[idx + width * 3 + 5] += (errorB * 1) / 16;
			}
		}
	}

	return output;
}

export function getImageDataFromImage(image: HTMLImageElement): ImageData {
	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');

	ctx.drawImage(image, 0, 0);
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function createImageUrlFromImageData(imageData: ImageData): string {
	const canvas = document.createElement('canvas');
	canvas.width = imageData.width;
	canvas.height = imageData.height;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');

	ctx.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
}
