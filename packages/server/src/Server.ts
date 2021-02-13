import express, { Express } from "express";
import http from "http";
import { SERVER_PORT } from "../../config";
import * as WebSocket from "ws";
import url from "url";
import Emitter from "@hackdonalds/emitter";
type Username = string;
export class Server {
  _server: http.Server;
  app: Express;
  wss: WebSocket.Server;
  _eventbus: Emitter;
  channels: { [id: string]: Username[] };
  constructor() {
    this.app = express();
    this._eventbus = new Emitter();
    this.channels = {};
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
    this.wss.on("connection", (ws: WebSocket, req) => {
      const channelID = url.parse(req.url as string, true).query
        .channelID as string;
      const clientID = url.parse(req.url as string, true).query
        .clientID as string;

      // Require the query parameter to connect xxx
      if (!channelID || !clientID) {
        ws.send("Please provide a channel ID by ?channelID=xxx&clientID=Xxx");
      }
      // Create channelif it doesn't exist
      const currentChannel = this.channels[channelID];
      if (!currentChannel) {
        this.channels[channelID] = [clientID];
      } else if (!currentChannel.includes(clientID)) {
        this.channels[channelID].push(clientID);
      } else {
        ws.send(`This channel already has a user named ${clientID}!`);
      }
      ws.send("HI");
    });
  }
}
