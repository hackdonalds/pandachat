import { Emitter } from "./lib/Emitter.js"
/**
 * @typedef {Object} SocketClientOpts
 * @property {string} username
 * @property {string} channelName
 * @property {string} url
 */

const { host, hash } = window.location
export class SocketClient extends Emitter {
    /**
     * 
     * @param {SocketClientOpts} opts 
     */
    constructor({
        username, channelName, url
    }) {
        super()
        this.username = username
        this.channelName = channelName
        this.connection = new WebSocket(url || `ws://localhost:8080/ws`)

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
    }
    /**
     * 
     * @param {any} data 
     */
    send(data) {
        this.connection?.send(JSON.stringify(data))
    }
    close() {
        this.connection.close()
    }
}