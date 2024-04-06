const socket = io('ws://localhost:3400')
const input = document.querySelector('input')
const form = document.querySelector('form')
const ul = document.querySelector('ul')
const activity = document.querySelector('.activity')

function sendMessage(e) {
    e.preventDefault()

    if (input.value){
        socket.emit('message', input.value)
        input.value = ''
    }
    input.focus()
}

form.addEventListener('submit', sendMessage)

// Listen for message we may receive from the server
socket.on('message', (data) => {
    activity.textContent = ''
    const li = document.createElement('li')
    li.textContent = data
    ul.appendChild(li)
})

input.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5))
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