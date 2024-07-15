<script lang="ts">
	import { page } from '$app/stores';
	import { io, type Socket } from 'socket.io-client';
	import {
		type RoomServerToClientEvents,
		type RoomClientToServerEvents,
		type State
	} from '$lib/mathex/schemas';

	import Identicon from '$lib/components/Identicon.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	const roomId = $page.params.id;

	let state: State = 'connecting';

	let name: string = '';

	import { toast } from 'svelte-sonner';

	const socket: Socket<RoomServerToClientEvents, RoomClientToServerEvents> = io(`/room-${roomId}`);
	socket.on('alert', (type, message) => {
		// @ts-ignore
		toast[type](message);
	});
	socket.on('connect', () => {
		if (state === 'connecting') state = 'choose-name';
		toast.success('Connected!');
	});
	socket.on('connect_error', () => toast.error('Failed to connect! Does this room exist?'));
	socket.on('disconnect', () => toast.warning('Disconnected!'));

	socket.on('lobby', () => (state = 'waiting_start'));
</script>

{#if state === 'connecting'}
	<span
		class="animate-pulse font-bold text-5xl flex text-center items-center w-full h-full justify-center"
		>Connecting...</span
	>
{:else if state === 'choose-name'}
	<div class="w-full h-full flex justify-center items-center align-middle text-center">
		<div class="flex flex-col rounded bg-white text-slate-900 w-min text-center p-2">
			{#if name}
				<div class="flex justify-center text-center">
					<Identicon seed={name} className="w-16 h-16" />
				</div>
			{:else}
				<span class="w-full h-16 text-2xl text-center flex justify-center items-center">?</span>
			{/if}
			<Input bind:value={name} type="text" placeholder="Name" class="w-64" maxlength={20} />
			<Button class="mt-2" on:click={() => socket.emit('join', name)}>Join</Button>
		</div>
	</div>
{:else if state === 'waiting_start'}
	<span
		class="animate-pulse font-bold text-4xl flex text-center items-center w-full h-full justify-center"
		>Waiting for game to start...</span
	>
{/if}
