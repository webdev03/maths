<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';

	import type { TextQuestion } from '../types';

	import Plus from 'lucide-svelte/icons/plus';
	import Minus from 'lucide-svelte/icons/minus';

	export let question: TextQuestion | null;
	if (question === null)
		question = {
			contents: '',
			solutions: []
		};
</script>

<div class="grid w-full gap-1.5">
	<Label for="question-text">Question text</Label>
	<Textarea
		id="question-text"
		placeholder="Type your question here."
		bind:value={question.contents}
	/>
</div>
<div class="mt-2 grid gap-1.5">
	<Label>Solutions</Label>
	{#each question.solutions as solution, i}
		<div class="flex gap-2">
			<Input type="text" bind:value={solution} /><Button
				on:click={() => {
					question.solutions = question.solutions.toSpliced(i, 1);
				}}><Minus class="mr-1" />Remove</Button
			>
		</div>
	{/each}
	<Button on:click={() => (question.solutions = [...question.solutions, ''])} class="w-48"
		><Plus class="mr-1" />Add solution</Button
	>
</div>
