import { z } from "zod";
import type { ToastT } from "svelte-sonner";

export const RoomName = z
  .string()
  .min(3, "The room name has to be at least 3 characters long")
  .max(60, "The room name cannot be greater than 60 characters long");

export type State = "connecting" | "choose-name" | "waiting_start" | "started" | "finished";

export interface RoomServerToClientEvents {
  alert: (type: ToastT["type"], message: string) => void;
  lobby: () => void;
  gameStart: () => void;
  gameFinish: () => void;
  running: () => void;
  stopRunning: () => void;
  newQuestion: (question: string, questionType: z.infer<typeof Question>["type"]) => void;
}

export interface RoomClientToServerEvents {
  join: (name: string) => void;
  answer: (value: z.infer<typeof Question>["data"]["solutions"][number]) => void;
}

export interface RoomInterServerEvents {}

export interface RoomSocketData {
  /**
   * The current question the player is up to
   */
  currentQuestion: number;
  /**
   * The amount of time the player took to finish in milliseconds, or null
   */
  finishingTime: number | null;
}

export interface RoomCreateClientToServerEvents {
  newRoom: (name: string, questions: z.infer<typeof Question>[]) => void;
  checkRoom: (id: string, callback: (exists: boolean) => void) => void;
}

export interface RoomCreateServerToClientEvents {
  goto: (path: string) => void;
}

export interface RoomCreateInterServerEvents {}

export interface RoomCreateSocketData {}

export interface RoomManageClientToServerEvents {
  start: () => void;
  finish: () => void;
  alertAll: (type: ToastT["type"], message: string) => void;
}

export interface RoomManageServerToClientEvents {
  alert: (type: ToastT["type"], message: string) => void;
}

export interface RoomManageInterServerEvents {}

export interface RoomManageSocketData {}

export const NumberQuestion = z.object({
  contents: z.string(),
  solutions: z.array(z.number())
});

export const TextQuestion = z.object({
  contents: z.string(),
  solutions: z.array(z.string())
});

export const ExpressionQuestion = z.object({
  contents: z.string(),
  solutions: z.array(z.string()),
  allowEquivalent: z.boolean()
});

export const Question = z.union([
  z.object({
    type: z.literal("number"),
    data: NumberQuestion
  }),
  z.object({
    type: z.literal("text"),
    data: TextQuestion
  }),
  z.object({
    type: z.literal("expression"),
    data: ExpressionQuestion
  })
]);

export interface Room {
  /**
   * Unique identity
   */
  id: string;
  /**
   * Name
   */
  name: string;
  /**
   * Questions list
   */
  questions: z.infer<typeof Question>[];
  /**
   * Token that the manager can use to manage the room
   */
  runToken: string;
  /**
   * If the game has started yet
   */
  state: "lobby" | "started" | "finished";
}

export interface ClientKnownRoom {
  /**
   * Unique identity
   */
  id: string;
  /**
   * Player count
   */
  playerCount: number;
  /**
   * Name
   */
  name: string;
  /**
   * Questions count
   */
  questionCount: number;
}
