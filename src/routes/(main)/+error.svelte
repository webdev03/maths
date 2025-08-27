<script lang="ts">
  import { page } from "$app/state";
</script>

<section class="p-2 mx-auto flex w-full flex-col items-center gap-2 py-6 md:py-12 md:pb-8 lg:py-24 lg:pb-20 pb-8">
  <h1 class="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
    {page.status} - {page.error?.message}
  </h1>
  <p class="max-w-[750px] text-center text-lg sm:text-xl text-balance text-muted-foreground">
    {#if page.status === 404}
      Hmm... maybe try going <a href="/" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">home</a>?
    {:else}
      Whoops!
    {/if}
  </p>
  {#if page.status === 404}
    <p class="max-w-[750px] text-center text-lg sm:text-xl text-balance text-muted-foreground">
      Or maybe solve a <a href="/games/problems" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >maths problem</a
      >?
    </p>
  {/if}
  <p class="mt-3 max-w-[750px] text-center text-lg sm:text-xl text-balance text-muted-foreground">
    If this was unexpected, please <a
      href="/contact"
      class="font-medium text-blue-600 dark:text-blue-500 hover:underline">contact us</a
    >.
  </p>
</section>
