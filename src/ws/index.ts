import { Server } from 'socket.io';

import { Server as httpServer } from 'http';
import { Server as HTTPSServer } from 'https';
import type { Http2SecureServer, Http2Server } from 'http2';
type ServerInstance = httpServer | HTTPSServer | Http2SecureServer | Http2Server;

import type {
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData,
	Room
} from '$lib/mathex/types';

export const createWSServer = (base: ServerInstance) => {
	const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
		base,
		{
			serveClient: false
		}
	);
	io.on('connection', (socket) => {
		socket.emit('alert', 'success', 'Hello, World');
	});
	return io;
};
