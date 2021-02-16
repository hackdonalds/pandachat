/**
 * Object.property:{get,set,delete,open,close,start,stop}
 *
 * {type : "user.speaking:start", payload:{username:"kucukkanat"}}
 * {type : "user.speaking:stop", payload:{username:"kucukkanat"}}
 * {type : "channel:start", payload:{name:"mychannel"}}
 * {type : "channel.users:get", payload:{name:"mychannel"}}
 */

// Outgoing to socket server
type RequestType =
  | "user.speaking:start"
  | "user.speaking:stop"
  | "channel:open"
  | "channel:close"
  | "channel.users:get"
  | "user.info:define";

// Incoming from socket server
type SocketEventType =
  | "channel.user:joined"
  | "channel.user:left"
  | "user.speaking:start"
  | "user.speaking:stop"
  | "channel:users:echo";

export type SocketMessageBearerType = {
  type: RequestType | SocketEventType;
  payload: any;
};
