<script lang="ts">
	import { Header } from '$lib/components/ui/header';

	interface Game {
		name: string;
		description: string;
		url: string;
		colour: string;
	}

	const games: Game[] = [
		{
			name: 'Digitle',
			description: 'A game where you guess a 5-digit number with a limited number of attempts.',
			url: '/games/digitle',
			colour: 'bg-blue-400'
		}
	];
</script>

<div class="p-2">
	<Header size="h1">Games</Header>
	<div class="mt-4 w-full grid grid-cols-5 gap-4">
		{#each games as game}
			<a href={game.url}
				><div class="{game.colour} p-3 rounded">
					<Header size="h3">{game.name}</Header>
					<p>{game.description}</p>
				</div></a
			>
		{/each}
	</div>
</div>
