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

wsServer.on('request', function (request) {
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