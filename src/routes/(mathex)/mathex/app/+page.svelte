<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Header } from '$lib/components/ui/header';
	import MoveLeft from 'lucide-svelte/icons/move-left';
</script>

<div class="flex flex-col h-full w-full justify-center items-center">
	<Header size="h1">Mathex</Header>
	<div class="w-64 *:w-full *:my-1">
		<Button href="/mathex/app/play" class="font-bold">Play</Button>
		<Button href="/mathex/app/create">Create</Button>
	</div>
	<Button variant="link" class="text-white" href="/"
		><MoveLeft class="mr-1" /> Back to Devarsh's Maths</Button
	>
</div>
