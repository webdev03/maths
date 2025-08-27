<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Header } from "$lib/components/ui/header";
  import * as InputOTP from "$lib/components/ui/input-otp";
  import MoveLeft from "@lucide/svelte/icons/move-left";
  import { toast } from "svelte-sonner";
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from "bits-ui";

  import { goto } from "$app/navigation";

  import { io, type Socket } from "socket.io-client";
  import type { RoomCreateClientToServerEvents, RoomCreateServerToClientEvents } from "$lib/mathex/schemas";
  const socket: Socket<RoomCreateServerToClientEvents, RoomCreateClientToServerEvents> = io("/rooms");

  let code: string = $state("");
  let lastCode: string = "";
  async function setCode(newCode: string) {
    code = newCode.toUpperCase();
    if (code.length === 8 && lastCode !== code) {
      lastCode = code;
      toast.promise(
        new Promise<void>(async (resolve, reject) => {
          if (await socket.emitWithAck("checkRoom", code)) {
            resolve();
          } else reject();
        }),
        {
          loading: "Loading...",
          success() {
            socket.disconnect();
            goto("/mathex/app/play/" + code);
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
    <InputOTP.Root
      maxlength={8}
      spellcheck="false"
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      bind:value={() => code, setCode}
    >
      {#snippet children({ cells })}
        {#each cells as cell (cell)}
          <InputOTP.Group>
            <InputOTP.Slot class="bg-gray-100 text-slate-900" {cell} />
          </InputOTP.Group>
        {/each}
      {/snippet}
    </InputOTP.Root>
  </div>
  <Button variant="link" class="text-white" href="/mathex/app"><MoveLeft class="mr-1" /> Back to home</Button>
</div>
