import { z } from 'zod';
import type { ToastT } from 'svelte-sonner';

export interface ServerToClientEvents {
	alert: (type: ToastT['type'], message: string) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface RoomSearchClientToServerEvents {}

export interface RoomSearchServerToClientEvents {
	data: (rooms: ClientKnownRoom[]) => void;
}

export interface RoomSearchInterServerEvents {}

export interface RoomSearchSocketData {}

export interface SocketData {
	name: string;
	age: number;
}

export const NumberQuestion = z.object({
	contents: z.string(),
	solutions: z.array(z.number())
});

export const TextQuestion = z.object({
	contents: z.string(),
	solutions: z.array(z.string())
});

export const Question = z.union([
	z.object({
		type: z.literal('number'),
		data: NumberQuestion
	}),
	z.object({
		type: z.literal('text'),
		data: TextQuestion
	})
]);

export interface Room {
	/**
	 * Unique identity
	 */
	id: string;
	/**
	 * Players as a list of socket IDs
	 */
	players: string[];
	/**
	 * Name
	 */
	name: string;
	/**
	 * Questions list
	 */
	questions: z.infer<typeof Question>[];
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
