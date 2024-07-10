import { z } from 'zod';
import type { ToastT } from 'svelte-sonner';

export const RoomName = z
	.string()
	.min(3, 'The room name has to be at least 3 characters long')
	.max(60, 'The room name cannot be greater than 60 characters long');

export interface ServerToClientEvents {
	alert: (type: ToastT['type'], message: string) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface RoomSearchClientToServerEvents {
	newRoom: (name: string, questions: z.infer<typeof Question>[]) => void;
}

export interface RoomSearchServerToClientEvents {
	data: (rooms: ClientKnownRoom[]) => void;
	goTo: (path: string) => void;
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
	/**
	 * Token that the manager can use to manage the room
	 */
	runToken: string;
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
