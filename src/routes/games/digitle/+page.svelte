<script lang="ts">
	import { Header } from '$lib/components/ui/header/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	type Item =
		| {
				type: 'empty';
				content: null;
		  }
		| {
				type: 'grey' | 'yellow' | 'green';
				content: string;
		  };

	type Board = Item[][];

	let guess = '';
	let guesses = 0;

	let board: Board = Array(6)
		.fill(null)
		.map(() =>
			Array(5)
				.fill(null)
				.map(() => ({
					type: 'empty',
					content: null
				}))
		);

	const target = Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, '0');

	const submit = () => {
		if(guess.length !== 5) return;
		board[guesses] = board[guesses].map((_, i) => {
			return {
				content: guess[i],
				type: target.includes(guess[i]) ? (guess[i] === target[i] ? "green" as const : "yellow" as const) : "grey" as const
			};
		});
		guesses++;
		if (guess === target) {
			alert(`You won in ${guesses} attempts!`);
			location.reload();
		} else if (guesses >= 6) {
			alert('You lost. The answer was ' + target);
			location.reload();
		}
		guess = '';
	};
</script>

<Header size="h1">Digitle</Header>
<div class="w-min">
	<div class="flex flex-col">
		{#each board as row}
			<div class="flex flex-row">
				{#each row as cell, j}
					<div
						class={`text-white font-boldYe flex justify-center items-center ${j !== 0 ? 'ml-2' : ''} mb-3 w-12 h-12 rounded ${cell.type === 'green' ? 'bg-green-400' : cell.type === 'yellow' ? 'bg-yellow-400' : 'bg-slate-400'}`}
					>
						{cell.content === null ? '' : cell.content}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex">
		<Input
			type="number"
			class="mr-2"
			bind:value={guess}
			on:keypress={(e) => {
				console.log(e);
				if (e.key === 'Enter') {
					submit();
				} else if (e.currentTarget.value.length > 4 || !'0123456789'.split('').includes(e.key)) {
					e.preventDefault();
				}
			}}
			on:paste={(e) => e.preventDefault()}
		/>
		<Button on:click={submit}>Guess</Button>
	</div>
</div>
