import Server from './../src/server'
import Socket from './../src/socket'
import ChannelManager from './../src/channels/manager'
import Message from './../src/message'

const json = (data: any) => JSON.stringify(data)

const server = new Server()
server.listen({ port: 8123 })

const channelManager = new ChannelManager()

server.on('connection', (socket: Socket) => {
    console.log(`New socket`)

    // const message = new Message('hello', { foo: 'bar' })
    // socket.send(message, 'PUSH').then(() => {
    //     console.log(`Message ${json(message)} sent`)
    // })

    socket.on('message', (message) => {
        console.log(`Got ${json(message)}`)
    })
    socket.on('error', (error) => {
        console.error(`Socket error ${error && error.message ? error.message : error}`)
    })
    socket.on('dead', () => {
        console.error(`Socket become dead`)
    })
    socket.on('close', (code, reason) => {
        console.error(`Socket closed ${code} ${reason}`)
    })

    channelManager.listen(socket)
})

const channel = channelManager.getOrCreateChannel('time')
setInterval(() => {
    const message = new Message('utc', new Date())
    channel.broadcast(message).then(() => {})
}, 1000)

const channel2 = channelManager.getOrCreateChannel('abc')
setInterval(() => {
    const message = new Message('letter', 'A')
    channel2.broadcast(message).then(() => {})
}, 1000)