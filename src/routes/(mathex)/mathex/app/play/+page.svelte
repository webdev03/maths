<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Header } from '$lib/components/ui/header';
	import MoveLeft from 'lucide-svelte/icons/move-left';

	let code: string[] = Array.from({ length: 8 }).map(() => '');

	function checkLetter(i: number) {
		code[i] = code[i].trim();
		if (code[i].length > 1) {
			let rest = code[i].split('').slice(1).join('');
			code[i] = code[i][0].toUpperCase();
			if (code[i + 1] !== undefined) {
				code[i + 1] += rest;
				document.getElementById('code-input' + (i + 1))?.focus();
				checkLetter(i + 1);
			}
		} else {
			code[i] = code[i].toUpperCase();
		}
	}
</script>

<div class="flex flex-col h-full w-full justify-center items-center">
	<Header size="h1">Rooms</Header>
	<div class="flex gap-1">
		{#each code as letter, i}
			<!-- svelte-ignore a11y-autofocus -->
			<input
				type="text"
				id="code-input{i}"
				class="w-12 h-12 block rounded text-slate-900 text-xl text-center"
				autofocus={i === 0}
				bind:value={letter}
				on:keydown={async (e) => {
					const prevEl = document.getElementById('code-input' + (i - 1));
					if (prevEl && letter === '' && e.key === 'Backspace') prevEl.focus();
				}}
				on:input={() => checkLetter(i)}
			/>
		{/each}
	</div>
	<Button variant="link" class="text-white" href="/mathex/app"
		><MoveLeft class="mr-1" /> Back to home</Button
	>
</div>
