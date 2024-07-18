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
    setTimeout(async () => {
      socket.emit("playerData", await getPlayers(roomNamespace));
    });
    socket.on("alertAll", async (type, message) => {
      roomNamespace.emit("alert", type, message);
    });
    socket.on("start", async () => {
      room.state = "started";
      roomNamespace.emit("gameStart");
      roomNamespace.emit("alert", "info", "Game has started!");
      const firstQuestion = room.questions[0];
      roomNamespace.emit("newQuestion", firstQuestion.data.contents, firstQuestion.type);
      for (const playerSocket of await roomNamespace.fetchSockets()) {
        playerSocket.data.startingTime = Date.now();
      }
      roomManageNamespace.emit("state", room.state);
      roomManageNamespace.emit("playerData", await getPlayers(roomNamespace));
    });
    socket.on("finish", async () => {
      room.state = "finished";
      roomNamespace.emit("alert", "info", "Game has finished for everyone!");
      for (const playerSocket of await roomNamespace.fetchSockets()) {
        if (!playerSocket.data.finishingTime) {
          playerSocket.data.finishingTime = Date.now();
          playerSocket.emit("gameFinish");
        }
      }
      roomManageNamespace.emit("state", room.state);
      roomManageNamespace.emit("playerData", await getPlayers(roomNamespace));
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
    socket.data = {
      currentQuestion: 1,
      startingTime: null,
      finishingTime: null,
      name: null
    };
    socket.on("join", async (name) => {
      if (!name || name.length > 20) return;
      const room = rooms.get(roomId);
      if (!room) {
        socket.disconnect();
        return;
      }
      socket.data.name = name;
      io.of(`/manage-${room.id}`).emit("playerData", await getPlayers(socket.nsp));
      if (room.state === "lobby") {
        socket.emit("lobby");
      } else if (room.state === "started") {
        socket.emit("gameStart");
        socket.data.startingTime = Date.now();
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
      setTimeout(async () => {
        socket.emit("stopRunning");
        if (isCorrect) {
          socket.emit("alert", "success", "Correct!");
          if (socket.data.currentQuestion >= room.questions.length) {
            socket.data.finishingTime = Date.now();
            socket.emit("alert", "success", "You have completed the questions!");
            socket.emit("gameFinish");
            socket.emit("confetti");
          } else {
            socket.data.currentQuestion++;
            const nextQuestion = room.questions[socket.data.currentQuestion - 1];
            socket.emit("newQuestion", nextQuestion.data.contents, nextQuestion.type);
          }
          io.of(`/manage-${room.id}`).emit("playerData", await getPlayers(socket.nsp));
        } else {
          socket.emit("alert", "error", "Wrong!");
        }
      }, 16 * 1000);
    });
  });

  async function getPlayers(
    ns: Namespace<RoomClientToServerEvents, RoomServerToClientEvents, RoomInterServerEvents, RoomSocketData>
  ) {
    let data: RoomSocketData[] = [];
    for (const playerSocket of await ns.fetchSockets()) {
      data.push(playerSocket.data);
    }
    data.sort((a, b) => {
      if (!a.startingTime || !b.startingTime) return 0;
      if (a.finishingTime && !b.finishingTime) return -1;
      if (b.finishingTime && !a.finishingTime) return 1;
      if (a.finishingTime && b.finishingTime)
        return b.finishingTime - b.startingTime - (a.startingTime - a.finishingTime);
      return b.currentQuestion - a.currentQuestion;
    });
    return data;
  }

  return io;
};

function checkSolution(guess: any, question: z.infer<typeof Question>) {
  if (question.type === "number") {
    return question.data.solutions.includes(Number(guess));
  } else if (question.type === "text") {
    return question.data.solutions.includes(String(guess).trim());
  } else if (question.type === "expression") {
    for (const solution of question.data.solutions) {
      try {
        if (math.symbolicEqual(solution, String(guess))) return true;
      } catch {}
    }
    return false;
  }
}
