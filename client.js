require('dotenv').config()

const WebSocketClient = require('websocket').client;

// const HOST = 'http://localhost'
const HOST = process.env.HOST
const PORT = process.env.PORT

const client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    connection.sendUTF('Hello')

    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });

    connection.on('message', function (msg) {
        if (msg.type === 'utf8') {
            console.log("Received: '" + msg.utf8Data + "'");
        }
    });

    function sendNumber() {
        if (connection.connected) {
            const number = Math.round(Math.random() * 0xFFFFFF);

            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 2000);
        }
    }

    sendNumber();
});

client.connect(`${HOST}:${PORT}/`, 'chat');