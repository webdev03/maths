<script lang="ts">
	import { io, type Socket } from 'socket.io-client';
	import {
		type RoomManageServerToClientEvents,
		type RoomManageClientToServerEvents
	} from '$lib/mathex/schemas';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Header } from '$lib/components/ui/header';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	const roomId = $page.url.searchParams.get('id');
	const runToken = $page.url.searchParams.get('runToken');

	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';

	const socket: Socket<RoomManageServerToClientEvents, RoomManageClientToServerEvents> = io(
		`/room-${roomId}`
	);
	socket.on('alert', (type, message) => {
		// @ts-ignore
		toast[type](message);
	});
	socket.on('connect', () => {
		toast.success('Connected!');
	});
	socket.on('connect_error', () => toast.error('Failed to connect!'));
	socket.on('disconnect', () => toast.warning('Disconnected!'));

	import type { ToastT } from 'svelte-sonner';
	let alertType: ToastT['type'] | null = null;
	function onSelectedAlertTypeChange(selection: any) {
		alertType = selection;
	}
	let alertText = '';
</script>

<div class="flex flex-col w-full h-full p-2 gap-y-2">
	<div class="p-3 rounded text-slate-900 bg-white">
		<Header size="h2">Alerts</Header>
		<div class="flex w-full">
			<Select.Root onSelectedChange={onSelectedAlertTypeChange}>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Alert Type" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="action">Action</Select.Item>
					<Select.Item value="success">Success</Select.Item>
					<Select.Item value="info">Info</Select.Item>
					<Select.Item value="warning">Warning</Select.Item>
					<Select.Item value="error">Error</Select.Item>
					<Select.Item value="loading">Loading</Select.Item>
					<Select.Item value="default">Default</Select.Item>
				</Select.Content>
			</Select.Root>
			<Input bind:value={alertText} class="ml-2" placeholder="Alert Text" />
			<Button
				class="ml-2"
				on:click={() => {
					if (alertType === null) {
						toast.error('Choose an alert type!');
						return;
					}
					if (!alertText) {
						toast.error('Write some alert text!');
						return;
					}
					socket.emit('alertAll', alertType, alertText);
				}}>Send</Button
			>
		</div>
	</div>
</div>
