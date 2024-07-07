<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Header } from '$lib/components/ui/header';
	import { FileInput } from '$lib/components/ui/file-input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	let files: FileList | undefined;

	function createRoom() {
		if (!files) {
			toast.error('No file uploaded!');
		}
	}
</script>

<div class="flex flex-col h-full w-full justify-center items-center">
	<Header size="h1">Create</Header>
	<div class="flex flex-col *:my-1">
		<div class="bg-white text-slate-900 p-2 rounded shadow w-64 *:w-full *:my-1">
			<Button href="/mathex/app/create/editor">Editor</Button>
		</div>
		<div class="bg-white text-slate-900 p-2 rounded shadow w-64 min-h-32 *:w-full *:my-1">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="email">Question Set</Label>
				<FileInput accept="application/json" bind:files />
			</div>
			<Button on:click={createRoom}>Start Room</Button>
		</div>
	</div>
</div>
