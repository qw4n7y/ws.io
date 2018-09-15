import Server from './../src/server'
import Socket from './../src/socket'
import ChannelManager from './../src/channels/manager'
import Message from './../src/message'

const server = new Server()
server.listen({ port: 8123 })

const channelManager = new ChannelManager()

server.on('connection', (socket: Socket) => {
    console.log('New socket')

    const message = new Message('hello', { foo: 'bar' })
    socket.send(message, 'PUSH').then(() => {
        console.log('Message sent')
    })

    channelManager.listen(socket)
})

const channel = channelManager.getOrCreateChannel('time')
setInterval(() => {
    const message = new Message('utc', new Date())
    channel.broadcast(message).then(() => {})
}, 1000)