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

export interface NumberQuestion {
	/**
	 * HTML contents
	 */
	contents: string;
	/**
	 * Solutions list
	 */
	solutions: number[];
}

export interface TextQuestion {
	/**
	 * HTML contents
	 */
	contents: string;
	/**
	 * Solutions list
	 */
	solutions: string[];
}

export type Question =
	| {
			type: 'number';
			data: NumberQuestion | null;
	  }
	| {
			type: 'text';
			data: TextQuestion | null;
	  };

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
	questions: Question[];
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