export type SocketMessage = {
    event: "init" | "user.joined" | "user.left" | "welcome",
    payload: any
}