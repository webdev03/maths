<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner";
  import "../../../../app.css";
  import "quill/dist/quill.snow.css";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <title>Mathex - Devarsh's Maths</title>
</svelte:head>
<Toaster />
<div class="bg-blue-400 text-white p-3 min-h-screen h-screen w-full">
  {@render children?.()}
</div>
