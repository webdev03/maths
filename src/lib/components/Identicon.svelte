<script lang="ts">
  import { minidenticon } from "minidenticons";

  export let className: string;
  export let seed: string;

  $: svg = minidenticon(seed);
</script>

<div class={className}>{@html svg}</div>
