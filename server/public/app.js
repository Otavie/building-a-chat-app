const socket = io('ws://localhost:3400')
const formMessage = document.querySelector('.form-message')
const formJoin = document.querySelector('.form-join')
const activity = document.querySelector('.activity')
const userList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')
const nameInput = document.querySelector('#name')
const messageInput = document.querySelector('#message')
const chatRoom = document.querySelector('#room')

function sendMessage(e) {
    e.preventDefault()

    if (messageInput.value && nameInput.value && chatRoom.value){
        socket.emit('message', {
            name: nameInput.value,
            text: messageInput.value
        })
        messageInput.value = ''
    }
    messageInput.focus()
}

function enterRoom(e) {
    e.preventDefault()

    if (nameInput.value && chatRoom.value) {
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value
        })
    }
}

formMessage.addEventListener('submit', sendMessage)
formJoin.addEventListener('submit', enterRoom)

messageInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for message we may receive from the server
socket.on('message', (data) => {
    activity.textContent = ''
    const { name, text, time } = data

    const li = document.createElement('li')
    
    li.className = 'post'

    if (name === nameInput.value) li.className = 'post post--left'
    if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right'
    if (name !== 'Admin') {
        li.innerHTML = `<div class='post__header' ${name === nameInput.value 
            ? 'post__header--user' 
            : 'post__header--reply'
        }>
        <span class='post__header--name'>${name}</span>
        <span class='post__header--time'>${time}</span>
        </div>
        <div class='post__text'>${text}</div>`
    } else {
        li.innerHTML = `<div class='post__text'>${text}</div>`
    }

    chatDisplay.appendChild(li)

    chatDisplay.scrollTop = chatDisplay.scrollHeight
})

let activityTimer

socket.on('activity', (username) => {
    activity.textContent = `${username} typing...`

    // Clear after 3 seconds without sending message
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ''
    }, 1500)
})

socket.on('userList', ({ users }) => {showUsers(users)})

socket.on('roomList', ({ rooms }) => {showRooms(rooms)})

function showUsers (users) {
    userList.textContent = ''

    if (users) {
        userList.innerHTML = `<em>Users in ${chatRoom.value}: </em>`
        users.forEach((user, i) => {
            userList.textContent += ` ${user.name}`

            if (users.length > 1 && i !== users.length - 1) {
                userList.textContent += ','
            }
        })
    }
}
function showUsers (users) {
    userList.textContent = ''

    if (users) {
        userList.innerHTML = `<em>Users in ${chatRoom.value}: </em>`
        users.forEach((user, i) => {
            userList.textContent += ` ${user.name}`

            if (users.length > 1 && i !== users.length - 1) {
                userList.textContent += ','
            }
        })
    }
}

function showRooms (rooms) {
    roomList.textContent = ''

    if (rooms) {
        roomList.innerHTML = `<em>Active rooms:</em>`
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`

            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ','
            }
        })
    }
}