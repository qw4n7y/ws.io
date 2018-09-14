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

    this.subscriptions.push(subscription)
  }

  public remove(subscription: Subscription) {
    this.subscriptions = this.subscriptions.filter(s => s !== subscription)
  }

  public async broadcast(message: Message) {
    for (let subscription of this.subscriptions) {
      if (!subscription.socket.isActive()) {
        continue
      }

      await subscription.socket.send(message, 'PUSH')
    }
  }
}

export default Channel