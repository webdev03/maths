<script lang="ts">
  import { minidenticon } from "minidenticons";

  interface Props {
    className: string;
    seed: string;
  }

  let { className, seed }: Props = $props();

  let svg = $derived(minidenticon(seed));
</script>

<div class={className}>{@html svg}</div>
