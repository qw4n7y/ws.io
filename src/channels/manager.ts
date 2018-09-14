import * as uuid from 'uuid'

import Channel from './channel'
import Subscription from './../subscriptions/subscription'
import Socket from '../socket';
import Message from '../message'

class Manager {
  public readonly channels: {[key: string]: Channel} = {}

  public listen(socket: Socket) {
    socket.on('message', this.reducer.bind(this, socket))
  }

  private reducer(socket: Socket, message: Message) {
    if (message.type === 'subscribe') {
      return this.onSubscribe(socket, message)
    }

    if (message.type === 'unsubscribe') {
      return this.onUnsubscribe(socket, message)
    }
  }

  private onSubscribe(socket: Socket, message: Message) {
    let invalid = !message.payload || !message.payload.channel
    if (invalid) {
      const error = new Error(`Got bizzare subscribe request: ${JSON.stringify(message)}`)
      throw error
    }

    const channelName = message.payload.channel
    let channel = this.channels[channelName]
    if (!channel) {
      channel = new Channel(channelName)
      this.channels[channelName] = channel
    }

    const subscriptions = channel.getSubscriptions()
    let subscription = subscriptions.find(s => s.socket === socket)
    if (!subscription) {
      const newId = uuid.v4()
      subscription = new Subscription(newId, channelName, socket)
    }

    channel.add(subscription)
  }

  private onUnsubscribe(socket: Socket, message: Message) {
    let invalid = !message.payload || !message.payload.subscription
    if (invalid) {
      const error = new Error(`Got bizzare unsubscribe request: ${JSON.stringify(message)}`)
      throw error
    }

    const clientSubscription = Subscription.fromJSON(message.payload.subscription, socket)

    let channel = this.channels[clientSubscription.channel]
    if (!channel) {
      return
    }

    const subscriptions = channel.getSubscriptions()
    let subscription = subscriptions.find(s => s.id === clientSubscription.id)
    if (!subscription) {
      return
    }

    channel.remove(subscription)
  }
}

export default Manager