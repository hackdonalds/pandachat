import Emitter from "@hackdonalds/emitter"
import * as SocketMessageTypes from "../../server/src/SocketMessageTypes"
import { User } from "../../server/src/User"
type SocketClientOpts = {
    username: string
    channelName: string
    url?: string
}

const { host, hash } = window.location
export class SocketClient extends Emitter<"init" | "open" | "close" | "message" | "initialized" | "error"> {
    username: string
    channelName: string
    connection: WebSocket
    channelUsers: Array<ReturnType<User["toJSON"]>>
    constructor({
        username, channelName, url
    }: SocketClientOpts) {
        super()
        this.username = username
        this.channelName = channelName
        this.connection = new WebSocket(url || `ws://${host}/ws`)
        this.channelUsers = []
        this.connection.onmessage = ({ data }) => this.emit("message", JSON.parse(data))

        this.connection.onclose = () => {
            this.emit("close")
        }
        this.connection.onopen = () => this.emit("open")
        this.connection.onerror = (err) => this.emit("error", err)

        this.on("open", () => {
            this.send({
                event: "init",
                payload: {
                    username,
                    channelName: channelName || hash
                }
            })
            this.emit("initialized")
        })
        this.on("message", (data: SocketMessageTypes.UserJoined | SocketMessageTypes.UserLeft) => {
            console.log("User joined:", data.payload)
        })
    }

    send(data: SocketMessageTypes.InitEvent) {
        this.connection?.send(JSON.stringify(data))
    }
    close() {
        this.connection.close()
    }
}