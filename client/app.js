const socket = io('ws://localhost:3400')
const input = document.querySelector('input')
const form = document.querySelector('form')
const ul = document.querySelector('ul')

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
    const li = document.createElement('li')
    li.textContent = data
    ul.appendChild(li)
})