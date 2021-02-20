import { User } from "./User"
// import WebSocket from "ws"
import { SocketMessage } from "./types"
export class Channel {
    users: User[]
    constructor(public name: string) {
        this.users = []
    }
    userJoin(user: User) {
        const foundUser = this.users.find(u => u === user)
        if (!foundUser) {
            this.users.push(user)
            this.broadcastUserJoined(user)
        } else {
            this.broadcastUserJoined(foundUser)
        }
    }
    userLeave(user: User) {
        this.users = this.users.filter(u => {
            if (u === user) {
                this.broadcastUserLeft(user)
            }
            return u !== user
        })
    }
    broadcastUserLeft(user: User) {
        this.broadcast(({
            event: "user.left",
            payload: user.toJSON()
        } as SocketMessage))
    }
    broadcastUserJoined(user: User) {
        this.broadcast(({
            event: "user.joined",
            payload: user.toJSON()
        } as SocketMessage))
    }
    broadcast(data: any) {
        this.users.forEach(user => {
            user.send(data)
        })
    }
}

export const channels: Channel[] = []

export function createOrGetChannel(name: string) {
    const foundChannel = channels.find(c => c.name === name)
    if (foundChannel) {
        return foundChannel
    } else {
        const newChannel = new Channel(name)
        channels.push(newChannel)
        return newChannel
    }
} 