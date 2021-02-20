import { createOrGetChannel } from "./Channel"
import { User } from "./User"

describe("Channel tests", () => {
    const channel = createOrGetChannel("test-channel")
    const user1 = new User("test-user-1")
    const user2 = new User("test-user-2")

    it("A user can join channel", () => {
        channel.userJoin(user1)
        expect(channel.users.find(u => u === user1)).toBe(user1)
    })
    it("A second user can join the channel", () => {
        channel.userJoin(user2)
        expect(channel.users.length).toBe(2)
    })
    it("The users array is correct when a user leaves", () => {
        channel.userLeave(user1)
        expect(channel.users.find(u => u === user1)).toBeFalsy()
        expect(channel.users.length).toBe(1)
    })
})