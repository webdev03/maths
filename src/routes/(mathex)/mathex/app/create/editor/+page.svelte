<script lang="ts">
  import { z } from "zod";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Header } from "$lib/components/ui/header";
  import * as Menubar from "$lib/components/ui/menubar";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Question } from "$lib/mathex/schemas";

  import NumberEditor from "$lib/mathex/editors/NumberEditor.svelte";
  import TextEditor from "$lib/mathex/editors/TextEditor.svelte";
  import ExpressionEditor from "$lib/mathex/editors/ExpressionEditor.svelte";
  import MoveRight from "@lucide/svelte/icons/move-right";
  import X from "@lucide/svelte/icons/x";

  let questions: z.infer<typeof Question>[] = $state([]);
  let currentQuestionIdx = $state(0);
  let currentQuestion = $derived(questions[currentQuestionIdx]);

  // Ask if you want to leave
  window.addEventListener("beforeunload", (e) => {
    if (questions.length === 0) return;

    e.preventDefault();
    // Included for legacy support
    e.returnValue = true;
  });

  let clearSetDialogOpen = $state(false);
  function clearSet() {
    currentQuestionIdx = 0;
    questions = [];
    clearSetDialogOpen = false;
  }

  function download() {
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions))
    );
    element.setAttribute("download", "set.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function upload() {
    let input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = "application/json";

    input.addEventListener(
      "change",
      async () => {
        if (!input.files) return;
        const file = input.files[0];
        currentQuestionIdx = 0;
        questions = JSON.parse(await file.text());
      },
      {
        once: true
      }
    );

    input.click();
  }

  function newQuestion(type: z.infer<typeof Question>["type"]) {
    if (questions.length >= 100) {
      alert("You cannot have more than 100 questions in a set!");
      return;
    }
    if (type === "number" || type === "text") {
      questions.push({
        type,
        data: {
          contents: "",
          solutions: []
        }
      });
    } else if (type === "expression") {
      questions.push({
        type,
        data: {
          contents: "",
          solutions: [],
          allowEquivalent: true
        }
      });
    }
    currentQuestionIdx = questions.length - 1;
    questions = questions;
  }

  function removeQuestion(i: number) {
    if (!confirm(`Do you really want to remove question ${i + 1}?`)) return;
    if (currentQuestionIdx === i) {
      if (currentQuestionIdx === 0) currentQuestionIdx++;
      else currentQuestionIdx--;
    }
    questions = questions.toSpliced(i, 1);
  }
</script>

<!-- Clear Set dialog -->
<AlertDialog.Root bind:open={clearSetDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete all questions in this set! <span class="font-bold"
          >Please make sure you have exported this set if you want to keep it!</span
        >
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class={buttonVariants({ variant: "destructive" })} onclick={clearSet}
        >Clear</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<div class="flex flex-col h-full">
  <Menubar.Root class="text-slate-900">
    <Menubar.Menu>
      <Menubar.Trigger>File</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Item onclick={() => (clearSetDialogOpen = true)}>Clear Set</Menubar.Item>
        <Menubar.Separator />
        <Menubar.Item onclick={upload}>Import JSON</Menubar.Item>
        <Menubar.Item onclick={download}>Export JSON</Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>
    <Menubar.Menu>
      <Menubar.Trigger>Insert</Menubar.Trigger>
      <Menubar.Content>
        <Menubar.Sub>
          <Menubar.SubTrigger>New Question</Menubar.SubTrigger>
          <Menubar.SubContent>
            <Menubar.Item onclick={() => newQuestion("number")}>Number</Menubar.Item>
            <Menubar.Item onclick={() => newQuestion("text")}>Text</Menubar.Item>
            <Menubar.Item onclick={() => newQuestion("expression")}>Expression</Menubar.Item>
          </Menubar.SubContent>
        </Menubar.Sub>
      </Menubar.Content>
    </Menubar.Menu>
  </Menubar.Root>
  <div class="mt-1 flex flex-row h-full w-full">
    <div class="bg-white text-slate-900 p-2 w-[80%] h-full rounded-md mr-1">
      {#if questions.length > 0}
        <Header size="h2">Question {currentQuestionIdx + 1}</Header>
        <div class="mt-2"></div>
        {#if currentQuestion.type === "number"}
          <NumberEditor question={currentQuestion.data} />
        {:else if currentQuestion.type === "text"}
          <TextEditor question={currentQuestion.data} />
        {:else if currentQuestion.type === "expression"}
          <ExpressionEditor question={currentQuestion.data} />
        {/if}
      {:else}
        <div class="w-full text-2xl italic text-center">
          You have to add a question (Insert <MoveRight class="inline" /> New Question) or load a file (File <MoveRight
            class="inline"
          /> Import JSON)
        </div>
      {/if}
    </div>
    <div class="bg-white text-slate-900 p-2 w-[20%] h-full rounded-md">
      {#each questions as _, i}
        <Button
          variant="ghost"
          class="w-full flex group"
          onclick={() => {
            currentQuestionIdx = i;
            questions = questions;
          }}
        >
          <span>Question {i + 1}</span>
          <div class="flex flex-1"></div>
          <button onclick={() => removeQuestion(i)}>
            <X class="invisible flex flex-1 text-right transition-all group-hover:visible" />
          </button>
        </Button>
      {:else}
        <p class="italic w-full text-center">No questions yet</p>
      {/each}
    </div>
  </div>
</div>
