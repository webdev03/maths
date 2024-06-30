<script lang="ts">
	import { page } from "$app/stores";
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';

	interface LinkBarItem {
		url: string;
		text: String;
	}

	const links: LinkBarItem[] = [
		{
			url: '/',
			text: 'Home'
		},
		{
			url: '/games',
			text: 'Games'
		},
		{
			url: '/mathex',
			text: 'Mathex'
		}
	];
</script>

<Toaster />
<nav class="bg-white border-gray-200 dark:bg-gray-900">
	<div class="flex flex-wrap items-center justify-between mx-auto p-4">
		<a href="/" class="flex items-center text-center self-center font-semibold">Devarsh's Maths</a>
		<div class="w-auto">
			<ul class="font-medium flex flex-row">
				{#each links as link}
				<li>
					<a
						href={link.url}
						aria-current={$page.url.pathname === link.url ? "page" : undefined}
						class={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-200 transition-all ${$page.url.pathname === link.url ? "text-blue-600" : ""}`}>{link.text}</a
					>
				</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>
<div class="p-2">
	<slot />
</div>
