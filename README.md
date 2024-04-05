# WebSocket Chat Application

This is a simple WebSocket chat application that facilitates real-time messaging between clients connected to the server. It consists of a server-side component built with Node.js and Socket.IO, and a client-side interface using HTML, CSS, and JavaScript.

### Features

- **Real-time Messaging:** Users can send and receive messages instantly, with updates displayed in real-time.
- **Simple Interface:** The application provides a minimalist user interface for sending and viewing messages.
- **WebSocket Communication:** Utilizes WebSocket technology for bi-directional communication between clients and the server.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Otavie/building-a-chat-app.git
   ```

2. Navigate to the `server` directory and install dependencies:

   ```bash
   cd server
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open the `index.html` file in a web browser to access the client-side interface.

### Usage

1. Open the `index.html` file in a web browser to access the client-side interface.
2. Enter a message in the input field and click the "Send" button to send the message to the server.
3. The server will broadcast the message to all connected clients, and the message will be displayed in the chat interface.

### Server Configuration

The server-side code (`app.js`) creates a WebSocket server using Socket.IO. It listens for incoming connections and relays messages between clients.

```javascript
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });
});
```

### Client Configuration

The client-side code (`app.js`) initializes a Socket.IO client and establishes a WebSocket connection with the server. It handles sending and receiving messages.

```javascript
const socket = io("ws://localhost:3400");
const input = document.querySelector("input");
const form = document.querySelector("form");
const ul = document.querySelector("ul");

function sendMessage(e) {
  e.preventDefault();

  if (input.value) {
    socket.emit("message", input.value);
    input.value = "";
  }
  input.focus();
}

form.addEventListener("submit", sendMessage);

// Listen for messages received from the server
socket.on("message", (data) => {
  const li = document.createElement("li");
  li.textContent = data;
  ul.appendChild(li);
});
```

### Dependencies

- **Node.js:** JavaScript runtime environment for the server-side application.
- **Socket.IO:** WebSocket library for Node.js and the browser, facilitating real-time bidirectional communication.
- **socket.io-client:** Socket.IO client library for the browser.

### Deployment

This application can be deployed to various hosting platforms or servers capable of running Node.js applications. Ensure that the server environment supports WebSocket connections and that necessary configurations, such as CORS settings, are properly configured.
