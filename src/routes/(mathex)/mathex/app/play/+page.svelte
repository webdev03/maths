<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Header } from '$lib/components/ui/header';
	import MoveLeft from 'lucide-svelte/icons/move-left';
	import type {
		RoomSearchServerToClientEvents,
		RoomSearchClientToServerEvents,
		ClientKnownRoom
	} from '$lib/mathex/schemas';
	import { io, type Socket } from 'socket.io-client';

	let rooms: ClientKnownRoom[] = [];
	let loading = true;
	const socket: Socket<RoomSearchServerToClientEvents, RoomSearchClientToServerEvents> =
		io('/rooms');
	socket.on('data', (data) => {
		loading = false;
		rooms = data;
	});
</script>

<div class="flex flex-col h-full w-full justify-center items-center">
	<Header size="h1">Rooms</Header>
	<div class="bg-white text-slate-900 p-2 rounded shadow w-64 h-80 overflow-scroll *:w-full *:my-1">
		{#each rooms as room}
			<div
				class="rounded outline-dashed outline-2 outline-offset-1 outline-blue-500 w-full flex p-1"
			>
				<div class="flex flex-col flex-1">
					<p class="text-lg font-bold">{room.name}</p>
					<p class="text-sm text-muted-foreground">{room.playerCount} players</p>
				</div>
				<Button href="/mathex/app/play/{room.id}">Join</Button>
			</div>
		{:else}
			<p class="italic text-center">
				{#if loading}
					Loading...
				{:else}
					No rooms found.
				{/if}
			</p>
		{/each}
	</div>
	<Button variant="link" class="text-white" href="/mathex/app"
		><MoveLeft class="mr-1" /> Back to home</Button
	>
</div>
