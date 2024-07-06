<script lang="ts">
	import { Header } from '$lib/components/ui/header/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	type ColourOfCell = 'grey' | 'yellow' | 'green';

	type Item =
		| {
				type: 'empty';
				content: null;
		  }
		| {
				type: ColourOfCell;
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

	const wordToMap = (word: string) => {
		let map: {
			[letter: string]: number;
		} = {};
		for (const letter of word.trim()) {
			if (map?.[letter]) map[letter]++;
			else map[letter] = 1;
		}
		return map;
	};

	const submit = () => {
		if (guess.length !== 5) return;
		board[guesses] = board[guesses].map((_, i) => {
			let type: ColourOfCell = 'yellow';
			if (guess[i] === target[i]) type = 'green';
			else {
				let targetMap = wordToMap(target);
				let noLetters = targetMap[guess[i]] || 0;
				if (noLetters === 0) type = 'grey';
				else {
					for (let a = 0; a < i; a++)
						if (target[a] === guess[a] && guess[a] === guess[i]) noLetters--;
					if (noLetters > 0) type = 'yellow';
					else type = 'grey';
				}
			}
			return {
				content: guess[i],
				type
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

<div class="p-2">
	<Header size="h1">Digitle</Header>
	<p class="mb-4">Inspired by Hooda Math</p>

	<Header size="h2">How to play?</Header>
	<p>
		This game is similar to the popular word game Wordle. In this game, rather than using the
		alphabet to construct words, you use the digits 0-9 to find the missing number.
	</p>
	<p>
		First, you have to place a guess and submit it. Then, a row of digit will appear. If a digit is <span
			class="text-green-400">green</span
		>, the target number has a digit in the same place with the same value. If a digit is
		<span class="text-yellow-400">yellow</span>, then the target number has a digit with the same
		value, but in a different place. Otherwise, the digit does not appear in the target number.
	</p>
	<p>
		If you have any suggestions, you can give us feedback on our GitHub repository by creating an
		issue.
	</p>

	<div class="w-min">
		<div class="flex flex-col">
			{#each board as row}
				<div class="flex flex-row">
					{#each row as cell, j}
						<div
							class={`text-white font-bold flex justify-center items-center ${j !== 0 ? 'ml-2' : ''} mb-3 w-12 h-12 rounded ${cell.type === 'green' ? 'bg-green-400' : cell.type === 'yellow' ? 'bg-yellow-400' : cell.type === 'grey' ? 'bg-slate-400' : 'bg-transparent border border-solid border-gray-400'}`}
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
</div>
