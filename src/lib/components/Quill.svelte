<script lang="ts">
  import "quill/dist/quill.snow.css";
  import Quill, { type QuillOptions } from "quill";
  import { onMount } from "svelte";
  export let options: QuillOptions = {};
  export let html = "";
  let node: HTMLDivElement;
  onMount(() => {
    let quill = new Quill(node, {
      theme: "snow",
      ...options
    });

    quill.clipboard.dangerouslyPasteHTML(html);

    quill.on("text-change", function () {
      html = quill.getSemanticHTML();
    });
  });
</script>

<div bind:this={node}></div>
