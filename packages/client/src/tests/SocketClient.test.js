import { SocketClient } from "../SocketClient.js"
import chai from "./chai.bundle.js"
const { expect } = chai
export const mochaHooks = {
    beforeEach(done) {
        // do something before every test
        done();
    }
};
describe("SocketClient tests", () => {
    const channelName = "test-channel"
    const client1Name = "test-user-1"
    const client1 = new SocketClient({
        channelName,
        username: client1Name
    })
    after(() => {
        client1.close()
    })
    it("creates the socket client with correct properties", () => {
        expect(client1.username).to.equal(client1Name)
        expect(client1.channelName).to.equal(channelName)
        expect(client1.connection instanceof WebSocket).to.be.true
    })
    it("receives the welcome message after connection", (done) => {
        let welcomeEventReceived = false
        client1.on("message", ({ event }) => {
            if (event === "welcome") {
                welcomeEventReceived = true
            }
        })

        setTimeout(() => {
            expect(welcomeEventReceived).to.be.true
            done()
        }, 2000);
    })
    it("receives another user joined notification", (done) => {
        let receivedUserJoinNotification = false
        const client2 = new SocketClient({
            channelName: 'test-channel',
            username: 'test-user-2'
        })
        client2.on("initialized", () => {
            client1.on("message", ({ event, payload }) => {
                console.log({ event, payload })
                if (event === "user.joined" && payload.name === client2.username) {
                    receivedUserJoinNotification = true
                }
            })
        })
        setTimeout(() => {
            expect(receivedUserJoinNotification).to.be.true
            done()
        }, 2000)

    })
})
