<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  export let answer: any;
</script>

<!-- TODO: Add MathQuill or similar fancy editor -->
<Input type="text" bind:value={answer} placeholder="Type your answer here" />
