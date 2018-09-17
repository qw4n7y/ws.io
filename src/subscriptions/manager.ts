import Socket from '../socket'
import Subscription from './subscription'
import Message from '../message'
import * as Errors from '../errors'

class Manager {
  private socket: Socket
  private subscriptions: Subscription[] = []

  constructor(socket: Socket) {
    this.socket = socket
    socket.on('message', this.onMessage.bind(this))
  }

  public getSubscriptions() {
    return this.subscriptions
  }

  private onMessage(message: Message) {
    const subscriptionId = message.subscriptionId
    if (!subscriptionId) {
      return
    }

    const subscription = this.subscriptions.find(s => s.id === subscriptionId)
    if (!subscription) {
      return
    }

    subscription.emit('message', message)
  }

  subscribe(channel: string): Promise<Subscription> {
    const message = new Message('subscribe', { channel })

    const existingSubscription = this.subscriptions.find(s => s.channel === channel)
    if (existingSubscription) {
      return Promise.resolve(existingSubscription)
    }

    return this.socket.send(message, 'CLIENT_SERVER').then((response: Message) => {
      let invalid = response.type !== 'subscribed' || !response.payload || !response.payload.subscription

      if (invalid) {
        const error = new Errors.BizarreMessage(JSON.stringify(response))
        throw error
      }

      const subscription = Subscription.fromJSON(response.payload.subscription, this.socket)
      this.subscriptions.push(subscription)

      return subscription
    })
  }

  unsubscribe(subscription: Subscription): Promise<boolean> {
    const message = new Message('unsubscribe', {
      subscription: subscription.toJSON()
    })

    return this.socket.send(message, 'CLIENT_SERVER').then((response: Message) => {
      let invalid = response.type !== 'unsubscribed' || !response.payload || !response.payload.subscription

      if (invalid) {
        const error = new Errors.BizarreMessage(JSON.stringify(response))
        throw error
      }

      const serverSubscription = Subscription.fromJSON(response.payload.subscription, this.socket)
      if (serverSubscription.id !== subscription.id) {
        const error = new Errors.BizarreMessage(`Desync: ${JSON.stringify(serverSubscription)} on server, ${JSON.stringify(subscription)} on client`)
        throw error
      }

      this.subscriptions = this.subscriptions.filter(s => s.id !== subscription.id)
      
      return true
    })
  }
}

export default Manager