/**
 * @typedef {Object} SocketClientOpts
 * @property {string} username
 * @property {string} channelName
 * @property {string} url
 */

const { host, hash } = window.location
export class SocketClient {
    /**
     * 
     * @param {SocketClientOpts} param0 
     */
    constructor({
        username, channelName, url
    }) {
        this.connection = new WebSocket(url)
        this.connection.onopen = () => {
            this.send({
                event: "init",
                payload: {
                    username,
                    channelName: channelName || hash
                }
            })
        }
    }
    /**
     * 
     * @param {any} data 
     */
    send(data) {
        this.connection?.send(JSON.stringify(data))
    }
}