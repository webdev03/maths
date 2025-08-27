<script lang="ts">
  import { run } from "svelte/legacy";

  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import Quill from "$lib/components/Quill.svelte";

  import { z } from "zod";
  import type { NumberQuestion } from "../schemas";

  import Plus from "@lucide/svelte/icons/plus";
  import Minus from "@lucide/svelte/icons/minus";

  interface Props {
    question: z.infer<typeof NumberQuestion> | null;
  }

  let { question = $bindable() }: Props = $props();
  if (question === null)
    question = {
      contents: "",
      solutions: []
    };
  run(() => {
    for (let i = 0; i < question.solutions.length; i++) {
      question.solutions[i] = Number(question.solutions[i]);
    }
  });
</script>

<div class="grid w-full gap-1.5">
  <Label for="question-text">Question text</Label>
  <Quill bind:html={question.contents} />
</div>
<div class="mt-2 grid gap-1.5">
  <Label>Solutions</Label>
  {#each question.solutions as _solution, i}
    <div class="flex gap-2">
      <Input type="number" bind:value={question.solutions[i]} /><Button
        onclick={() => {
          question.solutions = question.solutions.toSpliced(i, 1);
        }}><Minus class="mr-1" />Remove</Button
      >
    </div>
  {/each}
  <Button onclick={() => (question.solutions = [...question.solutions, 1])} class="w-48"
    ><Plus class="mr-1" />Add solution</Button
  >
</div>
