<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  interface Props {
    answer: any;
  }

  let { answer = $bindable() }: Props = $props();
</script>

<!-- TODO: Add MathQuill or similar fancy editor -->
<Input type="text" bind:value={answer} placeholder="Type your answer here" />
