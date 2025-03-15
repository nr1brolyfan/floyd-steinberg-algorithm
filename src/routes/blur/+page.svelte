<script lang="ts">
	import { applyBlur, getImageDataFromImage, createImageUrlFromImageData } from '$lib/blur';

	let originalImage = $state<HTMLImageElement | null>(null);
	let processedImageUrl = $state<string | null>(null);
	let radius = $state(5); // Default radius value (1-20)
	let isProcessing = $state(false);
	let imageWidth = $state(0);
	let imageHeight = $state(0);

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const file = input.files[0];
		if (!file.type.startsWith('image/')) {
			alert('Proszę wybrać plik obrazu');
			return;
		}

		isProcessing = true;

		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				originalImage = img;
				imageWidth = img.width;
				imageHeight = img.height;
				processImage();
			};
			img.src = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function processImage() {
		if (!originalImage) return;

		// Get image data from the original image
		const imageData = getImageDataFromImage(originalImage);

		// Apply blur effect
		const processedData = applyBlur(imageData, radius);

		// Convert processed image data to URL
		processedImageUrl = createImageUrlFromImageData(processedData);
		isProcessing = false;
	}

	// Update processed image when radius changes
	$effect(() => {
		if (originalImage) {
			processImage();
		}
	});
</script>

<div class="bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="text-center">
			<h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Efekt Rozmycia</h1>
			<p class="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
				Załącz obraz, żeby zastosować efekt rozmycia
			</p>
			<p class="text-red-400">Proszę stosować ostrożnie i powoli, może obciążyć komputer</p>
		</div>

		<div class="mt-10">
			<div class="mx-auto max-w-xl">
				<label for="file-upload" class="mb-2 block text-sm font-medium text-gray-700">
					Wybierz obraz
				</label>
				<input
					id="file-upload"
					type="file"
					accept="image/*"
					onchange={handleFileUpload}
					class="block w-full text-sm text-gray-500
                 file:mr-4 file:rounded-md file:border-0
                 file:bg-blue-50 file:px-4
                 file:py-2 file:text-sm
                 file:font-semibold file:text-blue-700
                 hover:file:bg-blue-100"
				/>
			</div>

			{#if originalImage}
				<div class="mt-8">
					<div class="mx-auto mb-6 max-w-xl">
						<label for="radius" class="mb-2 block text-sm font-medium text-gray-700">
							Promień rozmycia: {radius}
						</label>
						<input
							id="radius"
							type="range"
							min="1"
							max="20"
							bind:value={radius}
							class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
						/>
					</div>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div class="rounded-lg bg-white p-4 shadow">
							<h2 class="mb-4 text-lg font-medium text-gray-900">Oryginalne zdjęcie</h2>
							<div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
								<img src={originalImage.src} alt="Original" class="h-auto w-full object-contain" />
							</div>
							<p class="mt-2 text-sm text-gray-500">{imageWidth} × {imageHeight} px</p>
						</div>

						<div class="rounded-lg bg-white p-4 shadow">
							<h2 class="mb-4 text-lg font-medium text-gray-900">Przetworzony obraz</h2>
							<div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
								{#if isProcessing}
									<div class="flex h-full items-center justify-center">
										<div
											class="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"
										></div>
									</div>
								{:else if processedImageUrl}
									<img
										src={processedImageUrl}
										alt="Processed"
										class="h-auto w-full object-contain"
									/>
								{/if}
							</div>
							{#if processedImageUrl}
								<div class="mt-4 flex justify-center">
									<a
										href={processedImageUrl}
										download="blurred-image.png"
										class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
									>
										Pobierz
									</a>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
