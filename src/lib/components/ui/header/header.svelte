<script lang="ts">
	import type { Props } from './index.js';

	type $$Props = Props;

	export let size: $$Props['size'];
</script>

<svelte:element
	this={size}
	class={`scroll-m-20 ${size === 'h1' ? 'text-4xl' : size === 'h2' ? 'text-3xl' : size === 'h3' ? 'text-2xl' : 'text-xl'} font-extrabold tracking-tight`}
	><slot /></svelte:element
>
