import { v4 as uuidv4 } from 'uuid';
import WebSocket from "ws"
export class User {
    ws?: WebSocket
    id: string
    constructor(public name: string, ws?: WebSocket) {
        this.id = uuidv4()
        if (ws) {
            this.ws = ws
        }
    }
    send(data: any) {
        this.ws?.send(JSON.stringify(data))
    }
    toJSON() {
        const { name, id } = this
        return { name, id }
    }
}