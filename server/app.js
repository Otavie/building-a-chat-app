import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5500', 'http://127.0.0.1:5500']
    }
})

io.on('connection', socket => {
    // Shorten the socket id
    const shortenedId = socket.id.substring(0, 5)
    console.log(`User ${shortenedId} connected`)

    // Upon connection send a message to user using socket.emit
    // io.emit sends a message to everyone connected to the server
    socket.emit('message', 'Welcome to Chat App!')

    // Upon connection, let everyone know you are connected except you
    socket.broadcast.emit('message', `User ${shortenedId} connected`)

    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${shortenedId}: ${data}`)
    })

    // When user disconnects, all other users should get the update
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${shortenedId} disconnected!`)
    })

    // Listen for typing and send to others
    socket.on('activity', (username) => {
        socket.broadcast.emit('activity', username)
    })
})
