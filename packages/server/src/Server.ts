import express, { Express } from "express";
import http from "http";
import { Channel, createOrGetChannel } from "./Channel"
import { User } from "./User"
import { Emitter } from "@pandachat/core"
import * as WebSocket from "ws";
import path from "path"


export class Server {
  app: Express
  channels: Channel[]
  wss: WebSocket.Server
  _eventbus: Emitter
  _server: http.Server
  constructor(public PORT: number) {
    this.app = express();
    cors(this.app);

    static_serve(this.app);
    this._eventbus = new Emitter();
    this.channels = [];
    //initialize a simple http server
    this._server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this._server, path: "/ws" });
  }
  start() {
    this.initSocketHandler();
    return new Promise((resolve) => {
      this._server.listen(this.PORT, () => {
        resolve(true);
        console.log(`Server started on port ${this.PORT} :)`);
      });
    });
  }
  stop() {
    this._server.close();
  }
  initSocketHandler() {
    this.wss.on("connection", (ws) => {
      ws.send(JSON.stringify({ event: "welcome" }))

      let channel: null | Channel = null;
      let user: null | User = null;
      ws.on("message", (data: string) => {
        const message = JSON.parse(data);
        if (message.event === "init") {
          // Create a new user
          user = new User((message.payload.username as string), ws)
          channel = createOrGetChannel((message.payload.channelName as string))
          channel.userJoin(user)
        }
      });

      // Let users know user has left
      ws.on("close", () => {
        // User may have not created a channel yet
        if (channel && user) {
          (channel as Channel).userLeave(user);
        }
      });
    });
  }
}

/* istanbul ignore function */
const cors = (app: Express) => {
  app.use(function (_, res, next) {
    /* istanbul ignore next */
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    /* istanbul ignore next */
    next();
  });
};

/* istanbul ignore next */
export const static_serve = (app: Express) => {
  const servePath = path.join(__dirname, "../../client/src");
  app.use("/", express.static(servePath));
};
