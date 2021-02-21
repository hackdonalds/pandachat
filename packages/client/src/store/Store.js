import mobx from "../lib/mobx.js"

export const Store = mobx.observable({
    username: null,
    channelName: window.location.hash,
    channelUsers: []
})
window.Store = Store