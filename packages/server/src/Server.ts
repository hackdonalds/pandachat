import express, { Express } from "express";
import http from "http";
import { SERVER_PORT } from "../../config";
import * as WebSocket from "ws";
import Emitter from "@hackdonalds/emitter";
import { Channel, ClientMessage, ServerMessage, User } from "@pandachat/core";
import { SocketMessage } from "@pandachat/core/types";
type SocketConnection = WebSocket & User

export class Server {
  _server: http.Server;
  app: Express;
  wss: WebSocket.Server;
  _eventbus: Emitter;
  channels: Channel[];
  constructor() {
    this.app = express();
    this._eventbus = new Emitter();
    this.channels = [];
    //initialize a simple http server
    this._server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this._server });
  }
  start() {
    this.initSocketHandler();
    return new Promise((resolve) => {
      this._server.listen(SERVER_PORT, () => {
        resolve(true);
        console.log(`Server started on port ${SERVER_PORT} :)`);
      });
    });
  }
  stop() {
    this._server.close();
  }
  initSocketHandler() {
    this.wss.on("connection", (ws: SocketConnection) => {

      ws.on("message", (data: string) => {
        const parsedMessage: ClientMessage = JSON.parse(
          data
        ) as SocketMessage;
        
        Object.keys(parsedMessage)
        .forEach(key => {
          eventTriggers[key as keyof SocketMessage](ws,parsedMessage)
        })
      });
      ws.send("pong!");
    });
  }
  send(ws: SocketConnection, message: ServerMessage) {
    ws.send(JSON.stringify(message))
  }
}

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#example-18
// https://golang.org/doc/effective_go#blank
type HandlerFN = (ws:SocketConnection, message: ClientMessage)=>void
type ET = { [k in keyof Partial<SocketMessage>]: HandlerFN }
const eventTriggers: ET = {
  "user:declare": (ws:SocketConnection,message:SocketMessage) => {
    ws.username = message["user:declare"].username
  },
  "channel.users:list": () => { },
  "channel:close": () => { },
  "channel:open": () => { },
  "user.speaking:start": () => { },
  "user.speaking:stop": () => { },
}
