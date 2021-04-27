require('dotenv').config()

const WebSocketServer = require('websocket').server;

const Koa = require('koa')
const app = new Koa()

const PORT = process.env.PORT

app.use(ctx => {
    ctx.body = 'Koa WebSockets'
})

const server = require('http').createServer(app.callback())

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

function originIsAllowed(origin) {
    console.log(`Origin: ${origin}`)
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    const connection = request.accept('echo-protocol', request.origin)
    console.log((new Date()) + ' connection accepted')

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log(`Received message: ${message.utf8Data}`)

            connection.sendUTF(message.utf8Data)
        } else if (message.type === 'binary') {
            console.log(`Received binary message: ${message.binaryData.length} bytes`)

            connection.sendBytes(message.binaryData)
        }
    })

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected')
    })
})