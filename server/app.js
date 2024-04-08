import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT
const ADMIN = 'Admin'

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`)
})

// Set state for user
const userState = {
    users: [],
    setUsers: function (newUserArrays) {
        this.users = newUserArrays
    }
}

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
    socket.emit('message', buildMessage(ADMIN, "Welcome to Chat App!"))

    socket.on('enterRoom', ({ name, room }) => {
        // Leave a previous room if already in a previous room
        const prevRoom = findUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMessage(ADMIN, `${name} has left the room!`))
        }

        const user = activateUser(socket.id, name, room)

        // Cannot update previous room user list
        // Until after the state update in activate user
        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: findUserInRoom(prevRoom)
            })
        }

        // Join room
        socket.join(user.room)

        // To the user who joined
        socket.emit('message', buildMessage(ADMIN, `You have joined the ${user.room} chat room`))

        // To everyone else
        socket.broadcast.to(user.room).emit('message', buildMessage(ADMIN, `${user.name} has joined the room!`))
        
        // Update user list for room
        io.to(user.room).emit('userLis', {
            users: findUserInRoom(user.room)
        })

        // Update active room for everyone
        io.emit('roomList', {
            rooms: activeRooms()
        })
    })
    
    // When user disconnects, all other users should get the update
    socket.on('disconnect', () => {
        const user = findUser(socket.id)
        userLeaves(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMessage(ADMIN, `${user.name} has left the room`))
            
            io.to(user.room).emit('userList', {
                users: findUserInRoom(user.room)
            })

            io.emit('roomList', {
                rooms: activeRooms()
            })
        }

        console.log(`User ${shortenedId} disconnected`)
    })

    socket.on('message', ({ name, text }) => {
        const room = findUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMessage(name, text))
        }
    })

    // Listen for typing and send to others
    socket.on('activity', (name) => {
        const room = findUser(socket.id)?.room

        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })
    
})

function buildMessage (name, text) {
    return { 
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
     }
}

function activateUser(id, name, room) {
    const existingUserIndex = userState.users.findIndex(user => user.id === id);
    const user = { id, name, room };
  
    if (existingUserIndex !== -1) {
      // Update existing user in the array
      userState.users[existingUserIndex] = user;
    } else {
      // Add new user to the array
      userState.users.push(user);
    }
  
    return user;
}
  

function userLeaves (id) {
    userState.setUsers(
        userState.users.filter(user => user.id !== id)
    )
}

function findUser (id) {
    return userState.users.find(user => user.id === id)
}

function findUserInRoom (room) {
    return userState.users.filter(user => user.room === room)
}

function activeRooms () {
    return Array.from(new Set(userState.users.map(user => user.room)))
}