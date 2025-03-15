<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="flex justify-center py-4">
		<nav class="flex items-center gap-x-8">
			<a class="text-lg font-bold text-gray-900" href="/">Algorytm Floyda-Steinberga</a>
			<a class="text-lg font-bold text-gray-900" href="/blur">Rozmycie</a>
			<a class="text-lg font-bold text-gray-900" href="/saturation">Saturacja</a>
		</nav>
	</header>
	{@render children()}
</div>
