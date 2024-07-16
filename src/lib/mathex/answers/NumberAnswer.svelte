<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  export let answer: any;
</script>

<Input type="number" bind:value={answer} placeholder="Type your answer here" />
