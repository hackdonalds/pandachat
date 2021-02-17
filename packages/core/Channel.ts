import { User } from "./User";

export class Channel {
    constructor(public name:string,public users:User[]=[]){
        
    }
    userLeave(user: User) {
        this.users = this.users.filter(u => u.name !== user.name)
    }
    userJoin(user: User) {
        !this.users.find(u => u.name === user.name) && this.users.push(user)
    }
}