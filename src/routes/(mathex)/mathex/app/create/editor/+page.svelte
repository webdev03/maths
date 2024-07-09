<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Header } from '$lib/components/ui/header';
	import * as Menubar from '$lib/components/ui/menubar';
	import type { Question } from '$lib/mathex/types';
	import { defaultData } from "$lib/mathex/utils";

	import NumberEditor from '$lib/mathex/editors/NumberEditor.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import X from 'lucide-svelte/icons/x';

	let questions: Question[] = [];
	let currentQuestion = 0;

	function newQuestion(type: Question['type']) {
		questions.push({
			type,
			data: defaultData(type)
		});
		currentQuestion = questions.length - 1;
		questions = questions;
	}

	function removeQuestion(i: number) {
		if (!confirm(`Do you really want to remove question ${i + 1}?`)) return;
		questions = questions.toSpliced(i, 1);
	}
</script>

<div class="flex flex-col mt-1 h-full">
	<Menubar.Root class="text-slate-900">
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>Clear Set</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Import JSON</Menubar.Item>
				<Menubar.Item>Export JSON</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Insert</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Sub>
					<Menubar.SubTrigger>New Question</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item on:click={() => newQuestion('number')}>Number</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
	<div class="mt-1 flex flex-row h-full w-full">
		<div class="bg-white text-slate-900 p-2 w-[80%] h-full rounded-md mr-1">
			{#if questions.length > 0}
				<Header size="h2">Question {currentQuestion + 1}</Header>
				<div class="mt-2" />
				{#if questions[currentQuestion].type === 'number'}
					<NumberEditor question={questions[currentQuestion].data} />
				{/if}
			{:else}
				<div class="w-full text-2xl italic text-center">
					You have to add a question (Insert <MoveRight class="inline" /> New Question) or load a file (File <MoveRight class="inline" /> Import JSON)
				</div>
			{/if}
		</div>
		<div class="bg-white text-slate-900 p-2 w-[20%] h-full rounded-md">
			{#each questions as _, i}
				<Button variant="ghost" class="w-full flex group" on:click={() => {
					currentQuestion = i;
					questions = questions;
				}}>
					<span>Question {i + 1}</span>
					<div class="flex flex-1"></div>
					<button on:click={() => removeQuestion(i)}>
						<X class="invisible flex flex-1 text-right transition-all group-hover:visible" />
					</button>
				</Button>
			{:else}
				<p class="italic w-full text-center">No questions yet</p>
			{/each}
		</div>
	</div>
</div>
