<script lang="ts">
  import { page } from "$app/stores";
  import { io, type Socket } from "socket.io-client";
  import {
    type RoomServerToClientEvents,
    type RoomClientToServerEvents,
    type State,
    Question
  } from "$lib/mathex/schemas";

  import Identicon from "$lib/components/Identicon.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Header } from "$lib/components/ui/header";
  import { Progress } from "$lib/components/ui/progress";

  import NumberAnswer from "$lib/mathex/answers/NumberAnswer.svelte";
  import TextAnswer from "$lib/mathex/answers/TextAnswer.svelte";
  import ExpressionAnswer from "$lib/mathex/answers/ExpressionAnswer.svelte";

  import LoaderCircle from "lucide-svelte/icons/loader-circle";

  import { Confetti } from "svelte-confetti";
  let confetti = false;

  import DOMPurify from "dompurify";

  const roomId = $page.params.id;

  let state: State = "connecting";

  let name: string = "";

  import { toast } from "svelte-sonner";
  import type { z } from "zod";

  const socket: Socket<RoomServerToClientEvents, RoomClientToServerEvents> = io(`/room-${roomId}`);
  socket.on("alert", (type, message) => {
    // @ts-ignore
    toast[type](message);
  });
  socket.on("connect", () => {
    if (state === "connecting") state = "choose-name";
    toast.success("Connected!");
  });
  socket.on("connect_error", () => toast.error("Failed to connect! Does this room exist?"));
  socket.on("disconnect", () => toast.warning("Disconnected!"));

  socket.on("lobby", () => (state = "waiting_start"));

  let answer: z.infer<typeof Question>["data"]["solutions"][number] | null = null;

  let running: number | false = false;
  let runningVisible = 0;
  let currentQuestion: {
    number: number;
    content: string;
    type: z.infer<typeof Question>["type"];
  } = {
    number: 0,
    content: "<p>Loading...</p>",
    type: "text"
  };
  socket.on("gameStart", () => (state = "started"));
  socket.on("gameFinish", () => (state = "finished"));
  socket.on("confetti", () => (confetti = true));
  socket.on("newQuestion", (content, type) => {
    currentQuestion = {
      number: currentQuestion.number + 1,
      content: DOMPurify.sanitize(content),
      type
    };
    running = false;
  });
  socket.on("running", () => {
    running = Date.now();
    const interval = setInterval(() => {
      if (running) runningVisible = ((Date.now() - running) / 16000) * 100;
      else clearInterval(interval);
    });
  });
  socket.on("stopRunning", () => (running = false));
</script>

{#if state === "connecting"}
  <span class="animate-pulse font-bold text-5xl flex text-center items-center w-full h-full justify-center"
    >Connecting...</span
  >
{:else if state === "choose-name"}
  <div class="w-full h-full flex justify-center items-center align-middle text-center">
    <div class="flex flex-col rounded bg-white text-slate-900 w-min text-center p-2">
      {#if name}
        <div class="flex justify-center text-center">
          <Identicon seed={name} className="w-16 h-16" />
        </div>
      {:else}
        <span class="w-full h-16 text-2xl text-center flex justify-center items-center">?</span>
      {/if}
      <Input bind:value={name} type="text" placeholder="Name" class="w-64" maxlength={20} />
      <Button class="mt-2" on:click={() => socket.emit("join", name)}>Join</Button>
    </div>
  </div>
{:else if state === "waiting_start"}
  <span class="animate-pulse font-bold text-4xl flex text-center items-center w-full h-full justify-center"
    >Waiting for game to start...</span
  >
{:else if state === "started"}
  {#if running}
    <div class="p-3 bg-white text-slate-900 rounded">
      <Header size="h2">Running...</Header>
      <div class="flex justify-center items-center">
        <LoaderCircle class="animate-spin mr-2" />
        <Progress value={runningVisible} class="*:transition-none" />
      </div>
    </div>
  {:else}
    <div class="p-3 bg-white text-slate-900 rounded">
      <Header size="h2">Question {currentQuestion.number}</Header>
      <div class="prose prose-slate">{@html currentQuestion.content}</div>
      {#if currentQuestion.type === "number"}
        <NumberAnswer bind:answer />
      {:else if currentQuestion.type === "text"}
        <TextAnswer bind:answer />
      {:else if currentQuestion.type === "expression"}
        <ExpressionAnswer bind:answer />
      {/if}
      <Button
        class="mt-2"
        on:click={() => {
          if (!answer) {
            toast.error("Answer is null!");
            return;
          }
          socket.emit("answer", answer);
        }}>Submit</Button
      >
    </div>
  {/if}
{/if}
{#if confetti}
  <div class="fixed top-[-50px] left-0 h-screen w-screen flex justify-center overflow-hidden pointer-events-none">
    <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite duration={4000} amount={250} fallDistance="100vh" />
  </div>
{/if}
