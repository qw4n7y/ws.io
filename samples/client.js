const Socket = window.Socket
const SubscriptionManager = window.SubscriptionManager

const json = (data) => JSON.stringify(data)

const socket = Socket.connect('ws://127.0.0.1:8123')
window.socket = socket
const start = new Date()

socket.on('open', () => {
    console.log('Socket open')

    const subscriptionManager = new SubscriptionManager(socket)
    subscriptionManager.subscribe('time').then(subscription => {
        console.log('Subscribed on `time`')
        subscription.on('message', message => {
            console.log('>>>', message)
        })
    })
})

socket.on('error', (error) => {
    console.error(`Socket error ${error && error.message ? error.message : error}`)
})

socket.on('dead', () => {
    console.error(`Socket become dead`)
})

socket.on('close', (code, reason) => {
    const duration = (new Date()) - start
    console.error(`Socket closed ${code} ${reason} after ${duration / 1000} seconds`)
})

socket.on('message', (message) => {
    console.log(`Got message ${json(message)}`)
})