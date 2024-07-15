import { Server, type Namespace, type Socket } from 'socket.io';

import { Server as httpServer } from 'http';
import { Server as HTTPSServer } from 'https';
import type { Http2SecureServer, Http2Server } from 'http2';
type ServerInstance = httpServer | HTTPSServer | Http2SecureServer | Http2Server;

import {
	type RoomClientToServerEvents,
	type RoomServerToClientEvents,
	type RoomInterServerEvents,
	type RoomSocketData,
	type RoomCreateClientToServerEvents,
	type RoomCreateServerToClientEvents,
	type RoomCreateInterServerEvents,
	type RoomCreateSocketData,
	type RoomManageClientToServerEvents,
	type RoomManageServerToClientEvents,
	type RoomManageInterServerEvents,
	type RoomManageSocketData,
	type Room,
	type ClientKnownRoom,
	type State,
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
				runToken,
				started: false
			});
			socket.emit('goto', `/mathex/app/manage?id=${roomId}&runToken=${runToken}`);
			socket.disconnect();
		});
		socket.on('checkRoom', (id, callback) => callback(rooms.has(id)));
	});

	const roomManageNamespace = io.of(/^\/manage\-[0-9A-F]{8}$/) as Namespace<
		RoomManageClientToServerEvents,
		RoomManageServerToClientEvents,
		RoomManageInterServerEvents,
		RoomManageSocketData
	>;
	roomManageNamespace.on('connection', (socket) => {
		const roomId = /[0-9A-F]{8}/gm.exec(socket.nsp.name)?.[0];
		if (!roomId) throw Error('No room ID!');
		if (!rooms.has(roomId)) {
			socket.emit('alert', 'error', 'Room does not exist!');
			return;
		}
		const runToken = socket.handshake.query.runToken;
		if (!runToken || runToken !== rooms.get(roomId)?.runToken) {
			socket.disconnect();
			return;
		}
	});

	const roomNamespaces = io.of(/^\/room\-[0-9A-F]{8}$/) as Namespace<
		RoomClientToServerEvents,
		RoomServerToClientEvents,
		RoomInterServerEvents,
		RoomSocketData
	>;
	roomNamespaces.on('connection', (socket) => {
		const roomId = /[0-9A-F]{8}/gm.exec(socket.nsp.name)?.[0];
		if (!roomId) return;
		if (!rooms.has(roomId)) {
			socket.emit('alert', 'error', 'Room does not exist!');
			return;
		}
		socket.on('join', (name) => {
			if (!name || name.length > 20) return;
			const room = rooms.get(roomId);
			if (!room) {
				socket.disconnect();
				return;
			}
			if (room.started) {
				socket.emit('gameStart');
			} else {
				socket.emit('lobby');
			}
		});
	});
	return io;
};
