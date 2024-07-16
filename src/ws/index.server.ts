import { Server, type Namespace, type Socket } from "socket.io";

import { Server as httpServer } from "http";
import { Server as HTTPSServer } from "https";
import type { Http2SecureServer, Http2Server } from "http2";
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
  RoomName,
  Question
} from "$lib/mathex/schemas";

import { z } from "zod";

import { randomBytes } from "crypto";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

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
  > = io.of("/rooms");
  roomCreateNamespace.on("connection", (socket) => {
    socket.on("newRoom", (name, questions) => {
      const roomName = RoomName.parse(name);
      const roomQuestions = z.array(Question).parse(questions);

      const roomId = randomBytes(4).toString("hex").toUpperCase();
      const runToken = randomBytes(128).toString("hex").toUpperCase();
      rooms.set(roomId, {
        id: roomId,
        name: roomName,
        questions: roomQuestions,
        runToken,
        state: "lobby"
      });
      socket.emit("goto", `/mathex/app/manage?id=${roomId}&runToken=${runToken}`);
      socket.disconnect();
    });
    socket.on("checkRoom", (id, callback) => callback(rooms.has(id)));
  });

  const roomManageNamespace = io.of(/^\/manage\-[0-9A-F]{8}$/) as Namespace<
    RoomManageClientToServerEvents,
    RoomManageServerToClientEvents,
    RoomManageInterServerEvents,
    RoomManageSocketData
  >;
  roomManageNamespace.on("connection", (socket) => {
    const roomId = /[0-9A-F]{8}/gm.exec(socket.nsp.name)?.[0];
    if (!roomId) throw Error("No room ID!");
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("alert", "error", "Room does not exist!");
      socket.disconnect();
      return;
    }
    const runToken = socket.handshake.query.runToken;
    if (!runToken || runToken !== rooms.get(roomId)?.runToken) {
      socket.disconnect();
      return;
    }
    const roomNamespace = io.of(`/room-${roomId}`) as Namespace<
      RoomClientToServerEvents,
      RoomServerToClientEvents,
      RoomInterServerEvents,
      RoomSocketData
    >;
    socket.on("alertAll", async (type, message) => {
      roomNamespace.emit("alert", type, message);
    });
    socket.on("start", async () => {
      room.state = "started";
      roomNamespace.emit("gameStart");
      roomNamespace.emit("alert", "info", "Game has started!");
      const firstQuestion = room.questions[0];
      roomNamespace.emit("newQuestion", firstQuestion.data.contents, firstQuestion.type);
    });
    socket.on("finish", () => {
      room.state = "finished";
      roomNamespace.emit("gameFinish");
      roomNamespace.emit("alert", "info", "Game has finished!");
    });
  });

  const roomNamespaces = io.of(/^\/room\-[0-9A-F]{8}$/) as Namespace<
    RoomClientToServerEvents,
    RoomServerToClientEvents,
    RoomInterServerEvents,
    RoomSocketData
  >;
  roomNamespaces.on("connection", (socket): void => {
    const roomId = /[0-9A-F]{8}/gm.exec(socket.nsp.name)?.[0];
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("alert", "error", "Room does not exist!");
      return;
    }
    socket.data.currentQuestion = 1;
    socket.on("join", (name) => {
      if (!name || name.length > 20) return;
      const room = rooms.get(roomId);
      if (!room) {
        socket.disconnect();
        return;
      }
      if (room.state === "lobby") {
        socket.emit("lobby");
      } else if (room.state === "started") {
        socket.emit("gameStart");
        const firstQuestion = room.questions[0];
        socket.emit("newQuestion", firstQuestion.data.contents, firstQuestion.type);
      } else {
        socket.emit("gameFinish");
      }
    });
    socket.on("answer", (answer) => {
      const currentQuestion = room.questions[socket.data.currentQuestion - 1];
      socket.emit("running");
      const isCorrect = checkSolution(answer, currentQuestion);
      setTimeout(() => {
        // TODO
        socket.emit("stopRunning");
        if (isCorrect) {
        } else {
        }
      }, 16 * 1000);
    });
  });
  return io;
};

function checkSolution(guess: any, question: z.infer<typeof Question>) {
  if (question.type === "number") {
    return question.data.solutions.includes(guess);
  } else if (question.type === "text") {
    return question.data.solutions.includes(String(guess).toLowerCase());
  } else if (question.type === "expression") {
    for (const solution of question.data.solutions) {
      if (math.symbolicEqual(solution, String(guess))) return true;
    }
    return false;
  }
}
