const Socket = window.Socket
const SubscriptionManager = window.SubscriptionManager

const socket = Socket.connect('ws://127.0.0.1:8123')

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
    console.error(`Socket error ${error.message}`)
})