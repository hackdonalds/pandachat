import { Store } from "./Store.js"
import { SocketClient } from "../SocketClient"
/**
 * 
 * @param {string} username 
 * @param {string} channelName 
 */
export const connect = (username, channelName) => {
    Store.username = username
    Store.channelName = channelName
    const client = new SocketClient({
        username,
        channelName
    })
    client.on("user.joined", (user) => {
        addUserToChannel(user)
    })
    client.on("user.left", (user) => {
        removeUserFromChannel(user)
    })
}

const addUserToChannel = (user) => {
    const foundUser = Store.users.find(u => u.id === user.id)
    if (!foundUser) {
        Store.users.push(user)
    }
}
const removeUserFromChannel = (user) => {
    Store.users = Store.users.filter(u => u.id !== user.id)
}