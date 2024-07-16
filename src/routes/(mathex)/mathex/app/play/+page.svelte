<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Header } from "$lib/components/ui/header";
  import MoveLeft from "lucide-svelte/icons/move-left";
  import { toast } from "svelte-sonner";

  import { goto } from "$app/navigation";

  import { io, type Socket } from "socket.io-client";
  import type { RoomCreateClientToServerEvents, RoomCreateServerToClientEvents } from "$lib/mathex/schemas";
  const socket: Socket<RoomCreateServerToClientEvents, RoomCreateClientToServerEvents> = io("/rooms");

  let code: string[] = Array.from({ length: 8 }).map(() => "");
  let lastCode: string = "";
  async function checkLetter(i: number) {
    code[i] = code[i].trim();
    if (code[i].length > 1) {
      let rest = code[i].split("").slice(1).join("");
      code[i] = code[i][0].toUpperCase();
      if (code[i + 1] !== undefined) {
        code[i + 1] += rest;
        document.getElementById("code-input" + (i + 1))?.focus();
        checkLetter(i + 1);
      }
    } else {
      code[i] = code[i].toUpperCase();
    }

    const codeStr = code.join("");
    if (codeStr.length === 8 && lastCode !== codeStr) {
      lastCode = codeStr;
      toast.promise(
        new Promise<void>(async (resolve, reject) => {
          if (await socket.emitWithAck("checkRoom", codeStr)) {
            resolve();
          } else reject();
        }),
        {
          loading: "Loading...",
          success() {
            socket.disconnect();
            goto("/mathex/app/play/" + codeStr);
            return "Going to room...";
          },
          error: "That room does not exist! Try typing the room ID again."
        }
      );
    }
  }
</script>

<div class="flex flex-col h-full w-full justify-center items-center">
  <Header size="h1">Join Room</Header>
  <div class="flex gap-1 mt-2">
    {#each code as letter, i}
      <!-- svelte-ignore a11y-autofocus -->
      <input
        type="text"
        id="code-input{i}"
        class="w-12 h-12 block rounded-sm text-slate-900 text-xl text-center"
        autofocus={i === 0}
        bind:value={letter}
        on:keydown={async (e) => {
          const prevEl = document.getElementById("code-input" + (i - 1));
          if (prevEl && letter === "" && e.key === "Backspace") prevEl.focus();
        }}
        on:input={() => checkLetter(i)}
      />
    {/each}
  </div>
  <Button variant="link" class="text-white" href="/mathex/app"><MoveLeft class="mr-1" /> Back to home</Button>
</div>
