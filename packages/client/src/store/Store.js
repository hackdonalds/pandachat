import mobx from "../vendor/mobx.min.js"
console.log({ mobx })
export const Store = mobx.observable({
    username: null,
    channelName: window.location.hash,
    channelUsers: []
})
window.Store = Store