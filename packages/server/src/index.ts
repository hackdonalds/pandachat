import { Server } from "./Server"
import { PORT } from "./config"
const server = new Server(PORT)
server.start()