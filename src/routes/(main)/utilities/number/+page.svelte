<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Header } from "$lib/components/ui/header";

  let query = "";
  async function submit() {
    if (isNaN(Number(query))) return;
    requestAnimationFrame(() => goto(`/utilities/number/${query}`));
  }
</script>

<div class="flex flex-col justify-center items-center">
  <Header size="h1">Number Search</Header>
  <form on:submit={submit} class="p-2 flex justify-center max-w-sm items-center space-x-2">
    <Input
      bind:value={query}
      on:keypress={(e) => {
        if (e.key === "Enter") {
          submit();
        } else if (!"0123456789".split("").includes(e.key)) {
          e.preventDefault();
        }
      }}
      on:paste={(e) => e.preventDefault()}
      type="search"
      placeholder="Search for a number"
      class="w-64"
    />
    <Button type="submit">Search</Button>
  </form>
</div>
