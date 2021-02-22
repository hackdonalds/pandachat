import { observable } from "mobx"
import { User } from "../../../server/src/User"
type StoreDef = {
    username: string | null
    channelName: string
    channelUsers: User[]
}
export const Store = observable<StoreDef>({
    username: null,
    channelName: window.location.hash,
    channelUsers: []
});

(window as any).Store = Store