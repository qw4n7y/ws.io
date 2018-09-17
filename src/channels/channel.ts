import Subscription from './../subscriptions/subscription'
import Message from './../message'

class Channel {
  public readonly name: string
  private subscriptions: Subscription[] = []

  constructor(name: string) {
    this.name = name
  }

  public getSubscriptions() {
    return this.subscriptions
  }

  public add(subscription: Subscription) {
    if (this.subscriptions.indexOf(subscription) > -1) {
      return
    }

    subscription.on('dead', () => {
      this.remove(subscription)
    })

    console.log(`Subscription ${subscription.id} was added to channel ${this.name}`)
    this.subscriptions.push(subscription)
  }

  public remove(subscription: Subscription) {
    console.log(`Subscription ${subscription.id} was removed from channel ${this.name}`)
    this.subscriptions = this.subscriptions.filter(s => s !== subscription)
  }

  public async broadcast(message: Message) {
    for (let subscription of this.subscriptions) {
      if (!subscription.socket.isAlive()) {
        continue
      }
      if (!subscription.socket.isOpen()) {
        continue
      }

      const socketMessage = message.with({
        subscriptionId: subscription.id
      })

      await subscription.socket.send(socketMessage, 'PUSH')
    }
  }

  private bindSocketEventsHandlers() {
    
  }
}

export default Channel