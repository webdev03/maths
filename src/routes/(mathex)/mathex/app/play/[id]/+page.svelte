<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const roomId = data.id;

	import { io, type Socket } from 'socket.io-client';
	import { type ServerToClientEvents, type ClientToServerEvents } from '$lib/mathex/schemas';
	import { toast } from 'svelte-sonner';

	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`/room-${roomId}`);
    socket.on("alert", (type, message) => {
        // @ts-ignore
        toast[type](message);
    })
</script>
