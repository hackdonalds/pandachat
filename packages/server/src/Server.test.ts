import { Server } from "./Server";
import Websocket from "ws";
import { SERVER_PORT } from "../../config";
describe("Server tests", () => {
  let server: Server | null = null;
  const channelID = "test_channel";
  const clientID1 = "test_user";
  const clientID2 = "test_user2";
  beforeAll(async () => {
    server = new Server();
    await server.start();
  });
  afterAll(async () => {
    return await server.stop();
  });
  it("Expects the server to create a channel if it doesn't exist", async () => {
    const wsClient1 = new Websocket(
      `ws://localhost:${SERVER_PORT}/?channelID=${channelID}&clientID=${clientID1}`
    );

    await new Promise((resolve) => {
      wsClient1.onopen = () => {
        expect((server as Server).channels[channelID].length).toBe(1);

        const wsClient2 = new Websocket(
          `ws://localhost:${SERVER_PORT}/?channelID=${channelID}&clientID=${clientID2}`
        );

        wsClient2.onopen = () => {
          expect((server as Server).channels[channelID].length).toBe(2);

          wsClient2.close();
          wsClient1.close();
          resolve(null);
        };
      };
    });
  });
});
