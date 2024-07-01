<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	interface Property {
		header: string;
		fn: (n: number) => string;
	}

	const properties: Property[] = [
		{
			header: 'Is it even/odd?',
			fn(n) {
				return n % 2 === 0 ? 'Even' : 'Odd';
			}
		},
		{
			header: 'Is it prime?',
			fn(n) {
				for (let i = 2, s = Math.sqrt(n); i <= s; i++) {
					if (n % i === 0) return 'No';
				}
				return n > 1 ? 'Yes' : 'No';
			}
		},
		{
			header: 'What are its factors?',
			fn(n) {
				const factors: number[] = [];
				for (let i = 1; i <= n; i++) {
					if (n % i === 0) factors.push(i);
				}
				return factors.join(', ');
			}
		},
		{
			header: 'Is it triangular?',
			fn(n) {
				return Math.sqrt(8 * n + 1) % 1 === 0 ? 'Yes' : 'No';
			}
		},
		{
			header: 'Is it a perfect square?',
			fn(n) {
				return Math.sqrt(n) % 1 === 0 ? 'Yes' : 'No';
			}
		},
		{
			header: 'Is it a perfect cube?',
			fn(n) {
				return Math.cbrt(n) % 1 === 0 ? 'Yes' : 'No';
			}
		},
		{
			header: 'Is it a Fibonacci number?',
			fn(n) {
				return Math.sqrt(5 * n * n + 4) % 1 === 0 || Math.sqrt(5 * n * n - 4) % 1 === 0
					? 'Yes'
					: 'No';
			}
		}
	];
</script>

<div
	class="flex flex-col items-center py-20 bg-gradient-to-bl from-emerald-300 to-indigo-600 w-full"
>
	<span class="text-6xl text-center font-bold">{data.n}</span>
</div>
<div class="p-2 mt-4 w-full grid grid-cols-3 gap-4">
	{#each properties as property}
		<div class="p-2 rounded flex flex-col bg-emerald-300">
			<span class="font-semibold">{property.header}</span>
			<p>{property.fn(data.n)}</p>
		</div>
	{/each}
</div>
