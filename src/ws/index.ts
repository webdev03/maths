import { Server, type Namespace, type Socket } from 'socket.io';

import { Server as httpServer } from 'http';
import { Server as HTTPSServer } from 'https';
import type { Http2SecureServer, Http2Server } from 'http2';
type ServerInstance = httpServer | HTTPSServer | Http2SecureServer | Http2Server;

import type {
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData,
	RoomSearchClientToServerEvents,
	RoomSearchServerToClientEvents,
	RoomSearchInterServerEvents,
	RoomSearchSocketData,
	Room,
	ClientKnownRoom
} from '$lib/mathex/types';

export const createWSServer = (base: ServerInstance) => {
	let rooms: Map<string, Room> = new Map();
	const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
		base,
		{
			serveClient: false
		}
	);
	const roomSearchNamespace = io.of('/rooms') as unknown as Namespace<
		RoomSearchClientToServerEvents,
		RoomSearchServerToClientEvents,
		RoomSearchInterServerEvents,
		RoomSearchSocketData
	>;
	const getBroadcastRooms = () => {
		const keys = rooms.keys();
		let roomsTR: ClientKnownRoom[] = [];
		for (const key of keys) {
			const room = rooms.get(key);
			if (!room) continue;
			roomsTR.push({
				id: key,
				name: room.name,
				playerCount: room.players.length,
				questionCount: room.questions.length
			});
		}
		return roomsTR;
	};
	const broadcastRooms = () => roomSearchNamespace.emit('data', getBroadcastRooms());
	roomSearchNamespace.on('connection', (socket) => {
		socket.emit('data', getBroadcastRooms());
	});
	io.on('connection', (socket) => {
		socket.emit('alert', 'success', 'Hello, World');
	});
	return io;
};
