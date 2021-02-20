import { Server } from "./Server"
import WebSocket from "ws"
import { PORT } from "./config"

const connectionURL = `ws://localhost:${PORT}/ws`
describe("Test", () => {
    let server: Server | null = null
    beforeAll(async () => {
        server = new Server(PORT)
        await server.start()
    })
    afterAll(async () => {
        await server!.stop()
    })
    it("A client can connect and receive welcome message in a second", async () => {
        const client = new WebSocket(connectionURL)
        let receivedWelcomeMessage = false

        await new Promise(resolve => {

            client.onmessage = ({ data }) => {
                const { event } = JSON.parse(data as string)
                if (event === "welcome") {
                    receivedWelcomeMessage = true
                }
            }

            setTimeout(() => {
                expect(receivedWelcomeMessage).toBe(true)
                client.close()
                resolve(null)
            }, 1500)
        })
    })

    it("Other clients are notified when a user joins", async () => {
        const user1 = new WebSocket(connectionURL)
        const user2 = new WebSocket(connectionURL)
        const username1 = "test-user-1"
        const username2 = "test-user-2"
        let userNotifiedOfSecondUser = false

        user1.onmessage = ({ data }) => {
            const parsedMessage = JSON.parse(data as string)
            const { event, payload } = parsedMessage

            if (event === "user.joined" && payload.name == username2) {
                userNotifiedOfSecondUser = true
            }
        }
        await new Promise(resolve => {
            user1.onopen = () => {
                user1.send(JSON.stringify({
                    event: "init",
                    payload: {
                        username: username1,
                        channelName: "test-channel"
                    }
                }))
                resolve(null)
            }
        })

        user2.onopen = () => {
            user2.send(JSON.stringify({
                event: "init",
                payload: {
                    username: username2,
                    channelName: "test-channel"
                }
            }))
        }

        await new Promise(resolve => {
            setTimeout(() => {
                expect(userNotifiedOfSecondUser).toBe(true)
                user1.close()
                user2.close()
                resolve(null)
            }, 1500)
        })
    }, 10000)
})