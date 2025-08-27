<script lang="ts">
  import type { Props } from "./index.js";

  type $$Props = Props;

  interface Props_1 {
    size: $$Props["size"];
    children?: import("svelte").Snippet;
  }

  let { size, children }: Props_1 = $props();
</script>

<svelte:element
  this={size}
  class={`scroll-m-20 ${size === "h1" ? "text-4xl" : size === "h2" ? "text-3xl" : size === "h3" ? "text-2xl" : "text-xl"} font-extrabold tracking-tight`}
  >{@render children?.()}</svelte:element
>
