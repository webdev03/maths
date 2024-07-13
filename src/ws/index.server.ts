import { Server, type Namespace, type Socket } from 'socket.io';

import { Server as httpServer } from 'http';
import { Server as HTTPSServer } from 'https';
import type { Http2SecureServer, Http2Server } from 'http2';
type ServerInstance = httpServer | HTTPSServer | Http2SecureServer | Http2Server;

import {
	type ClientToServerEvents as RoomClientToServerEvents,
	type ServerToClientEvents as RoomServerToClientEvents,
	type InterServerEvents as RoomInterServerEvents,
	type SocketData as RoomSocketData,
	type RoomCreateClientToServerEvents,
	type RoomCreateServerToClientEvents,
	type RoomCreateInterServerEvents,
	type RoomCreateSocketData,
	type Room,
	type ClientKnownRoom,
	RoomName,
	Question
} from '$lib/mathex/schemas';
import { z } from 'zod';

import { randomBytes } from 'crypto';

export const createWSServer = (base: ServerInstance) => {
	let rooms: Map<string, Room> = new Map();
	const io = new Server(base, {
		serveClient: false
	});
	const roomCreateNamespace: Namespace<
		RoomCreateClientToServerEvents,
		RoomCreateServerToClientEvents,
		RoomCreateInterServerEvents,
		RoomCreateSocketData
	> = io.of('/rooms');
	roomCreateNamespace.on('connection', (socket) => {
		socket.on('newRoom', (name, questions) => {
			const roomName = RoomName.parse(name);
			const roomQuestions = z.array(Question).parse(questions);

			const roomId = randomBytes(4).toString('hex').toUpperCase();
			const runToken = randomBytes(128).toString('hex').toUpperCase();
			rooms.set(roomId, {
				id: roomId,
				name: roomName,
				players: [],
				questions: roomQuestions,
				runToken
			});
			socket.emit('goto', `/mathex/app/manage?id=${roomId}&runToken=${runToken}`);
			socket.disconnect();
		});
		socket.on('checkRoom', (id, callback) => callback(rooms.has(id)));
	});

	const roomNamespaces = io.of(/^\/room\-[0-9A-F]{8}$/) as Namespace<
		RoomClientToServerEvents,
		RoomServerToClientEvents,
		RoomInterServerEvents,
		RoomSocketData
	>;
	roomNamespaces.on('connection', (socket) => {
		socket.emit("alert", "success", "Hi!!")
	});
	return io;
};
