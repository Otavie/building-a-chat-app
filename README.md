# WebSocket Intro

This is a simple WebSocket application that serves as an introduction to WebSocket technology. It consists of a client-side and server-side component for real-time communication between a client and a server.

#### Features

- **Real-time Messaging:** Allows users to send and receive messages in real-time between the client and server.
- **Simple Interface:** Provides a minimalistic user interface for sending and displaying messages.
- **WebSocket Communication:** Utilizes WebSocket technology for bi-directional communication between the client and server.

#### Installation

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

4. Open the `index.html` file in a web browser to start the client-side application.

#### Usage

1. Open the `index.html` file in a web browser to access the client-side interface.
2. Enter a message in the input field and click the "Send" button to send the message to the server.
3. The server will echo the message back to all connected clients, and the message will be displayed in the list of messages.

#### Dependencies

- **Node.js:** JavaScript runtime environment for the server-side application.
- **ws:** WebSocket library for Node.js, used for handling WebSocket connections.
