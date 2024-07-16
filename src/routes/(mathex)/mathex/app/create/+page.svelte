<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Header } from "$lib/components/ui/header";
  import { FileInput } from "$lib/components/ui/file-input";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { toast } from "svelte-sonner";

  import {
    Question,
    RoomName,
    type RoomCreateServerToClientEvents,
    type RoomCreateClientToServerEvents
  } from "$lib/mathex/schemas";
  import { z } from "zod";

  import { io, type Socket } from "socket.io-client";
  import { goto } from "$app/navigation";
  const socket: Socket<RoomCreateServerToClientEvents, RoomCreateClientToServerEvents> = io("/rooms");

  let files: FileList | undefined;
  let roomName = "";

  async function createRoom() {
    if (!files) {
      toast.error("No file uploaded!");
      return;
    }
    let set: z.infer<typeof Question>[] | null = null;
    try {
      set = z.array(Question).parse(JSON.parse(await files[0].text()));
    } catch {
      toast.error("Invalid set file!");
      return;
    }
    let roomNameValidation = await RoomName.safeParseAsync(roomName);
    if (!roomNameValidation.success) {
      toast.error(roomNameValidation.error.toString());
      return;
    }
    socket.emit("newRoom", roomNameValidation.data, set);
    socket.once("goto", (path) => {
      socket.disconnect();
      goto(path);
    });
  }
</script>

<div class="flex flex-col h-full w-full justify-center items-center">
  <Header size="h1">Create</Header>
  <div class="flex flex-col *:my-1">
    <div class="bg-white text-slate-900 p-2 rounded shadow w-64 *:w-full *:my-1">
      <Button href="/mathex/app/create/editor">Editor</Button>
    </div>
    <div class="bg-white text-slate-900 p-2 rounded shadow w-64 min-h-32 *:w-full *:my-1">
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="email">Question Set</Label>
        <FileInput accept="application/json" bind:files />
      </div>
      <div class="flex w-full max-w-sm flex-col gap-1.5">
        <Label for="email">Room Name</Label>
        <Input accept="application/json" bind:value={roomName} />
      </div>
      <Button on:click={createRoom}>Create Room</Button>
    </div>
  </div>
</div>
