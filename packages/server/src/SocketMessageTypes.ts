import { User } from "./User";

export type UserJoined = {
    event: "user.joined",
    payload: ReturnType<User["toJSON"]>
}

export type InitEvent = {
    event: "init",
    payload: {
        username: string
        channelName: string
    }
}

export type UserLeft = {
    event: "user.left"
    payload: ReturnType<User["toJSON"]>
}
