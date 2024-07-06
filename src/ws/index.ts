import { Server } from 'socket.io';
import { Server as httpServer } from 'http';
import { Server as HTTPSServer } from 'https';
import type { Http2SecureServer, Http2Server } from 'http2';
type ServerInstance = httpServer | HTTPSServer | Http2SecureServer | Http2Server;

export const createWSServer = (base: ServerInstance) => {
	const io = new Server(base, {
		serveClient: false
	});
	io.on('connection', (socket) => {
		socket.emit('alert', 'Hello, World');
	});
	return io;
};
