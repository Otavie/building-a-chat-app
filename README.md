## WebSocket Chat Application

This is a simple WebSocket chat application that facilitates real-time messaging between clients connected to the server. It consists of a server-side component built with Node.js and Socket.IO, and a client-side interface using HTML, CSS, and JavaScript.

### Features

- **Real-time Messaging:** Users can send and receive messages instantly, with updates displayed in real-time.
- **Simple Interface:** The application provides a minimalist user interface for sending and viewing messages, including typing indicators.
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
4. As you type in the input field, other connected users will see a "typing..." indicator for your username.

### Server Configuration

The server-side code (`app.js`) creates a WebSocket server using Socket.IO. It listens for incoming connections, relays messages between clients, and handles user disconnections. Additionally, it broadcasts typing activity to connected users.

**Changes:**

- The code now listens for the `'disconnect'` event and broadcasts a message to other users when a user disconnects.
- It listens for the `'activity'` event emitted by the client when a user starts typing and broadcasts the username to other users. This creates a typing indicator functionality.

### Client Configuration

The client-side code (`app.js`) initializes a Socket.IO client and establishes a WebSocket connection with the server. It handles sending and receiving messages and implements typing indicator functionality.

**Changes:**

- The client listens for the `'keypress'` event on the input field and emits the shortened user ID as an `'activity'` event to indicate typing activity.
- It listens for the `'activity'` event received from the server and updates the UI to display a typing indicator for other users.

### Dependencies

- **Node.js:** JavaScript runtime environment for the server-side application.
- **Socket.IO:** WebSocket library for Node.js and the browser, facilitating real-time bidirectional communication.
- **socket.io-client:** Socket.IO client library for the browser.

### Deployment

This application can be deployed to various hosting platforms or servers capable of running Node.js applications. Ensure that the server environment supports WebSocket connections and that necessary configurations, such as CORS settings, are properly configured.
