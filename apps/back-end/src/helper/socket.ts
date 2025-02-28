import { IncomingMessage, Server, ServerResponse } from "http";
import socket from "socket.io";
import { socketJWTAndRoomJoin } from "./jwt";

export let socketIo: socket.Server;

export const createSocketServer = (app: Server<typeof IncomingMessage, typeof ServerResponse>) => {
    socketIo = new socket.Server(app);

    socketIo.on("connection", (socket) => {
        // console.log("socket connected")
        // console.log(socket.id)
        socketJWTAndRoomJoin(socket);
    });
}