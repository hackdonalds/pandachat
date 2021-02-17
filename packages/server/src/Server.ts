import express, { Express } from "express";
import http from "http";
import { SERVER_PORT } from "../../config";
import * as WebSocket from "ws";
import Emitter from "@hackdonalds/emitter";
import { Channel, User } from "@pandachat/core";
import { SocketMessage } from "@pandachat/core/types";

export class Server {
  _server: http.Server;
  app: Express;
  wss: WebSocket.Server;
  _eventbus: Emitter;
  channels: Channel[];
  users: User[];
  constructor() {
    this.app = express();
    this._eventbus = new Emitter();
    this.channels = [];
    this.users = []
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
    this.wss.on("connection", (ws) => {
      // After a user is connected to create an actual user instance we wait for the declaration
      let user: User | null = null
      ws.on("message", (data: string) => {
        const message: SocketMessage = JSON.parse(
          data
        ) as SocketMessage;

        if (message.type === "user:declare") {
          const foundUser = this.getUserByUsername(message.payload.name)
          if (foundUser) {
            ws.send(JSON.stringify({
              type: "error:user_exists",
              message: `A user with username ${message.payload.name} already exists`
            }))
          } else {
            user = new User(message.payload.name)
            user.attachWebSocketConnection(ws)
            this.userOnline(user)
            user.send({
              type: "user:created",
              payload: { id: user.id }
            })
          }
        }

      });
      ws.send("pong!");
    });
  }
  getUserByUsername(username: string) {
    return this.users.find(u => u.name === username)
  }
  createChannel(name: string) {
    const newChannel: Channel = new Channel(name)
    this.channels.push(newChannel)
    return newChannel
  }
  getOrCreateChannel(channelName: string): Channel {
    const foundChannel = this.channels.find(channel => channel.name == channelName)
    if (foundChannel) {
      return foundChannel
    } else {
      return this.createChannel(channelName)
    }
  }
  userOnline(user: User) {
    this.users.push(user)
    return user
  }
  userOffline(user: User) {
    this.users = this.users.filter(u => u.name !== user.name)
    return this.users
  }
}

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#example-18
// https://golang.org/doc/effective_go#blank
