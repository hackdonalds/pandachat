import { v4 as uuidv4 } from 'uuid';
import WebSocket from "ws";
export class User {
    id: string
    createdAt: Date
    ws:WebSocket
    constructor(public name: string, public profilePicture?: string) {
        this.id = uuidv4()
        this.createdAt = new Date()
    }
    setProfilePicture(pp: string) {
        this.profilePicture = pp
    }
    attachWebSocketConnection(ws:WebSocket) {
        this.ws = ws
    }
    send(data: any) {
        this.ws.send(JSON.stringify(data))
    }
}