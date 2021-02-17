export type User = {
  username: string
  profilePicture?: string
  online?: boolean
}

export interface Channel {
  name: string
  users: User[]
  createdAt?: Date
}

type EventName = "user:declare" |
  "user.speaking:start" |
  "user.speaking:stop" |
  "channel:open" |
  "channel:close" |
  "channel.user:joined" |
  "channel.user:left" |
  "channel.users:list" |
  "user.speaking:start" |
  "user.speaking.stop";

type Payload = {
  name?: string
  profilePicture?: string
} & User[]
export type SocketMessage = {
  type: EventName
  payload: Payload
}
