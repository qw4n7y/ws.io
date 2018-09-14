import * as events from 'events'

import Socket from './../socket'

type SubscriptionId = string
export { SubscriptionId }

class Subscription extends events.EventEmitter {
  public readonly id: SubscriptionId
  public readonly channel: string
  public readonly socket: Socket

  constructor(id: SubscriptionId, channel: string, socket: Socket) {
    super()
    this.id = id
    this.channel = channel
    this.socket = socket
  }

  public toJSON() {
    return {
      id: this.id,
      channel: this.channel
    }
  }

  public static fromJSON(data: any, socket: Socket) {
    const subscription = new Subscription(data.id, data.channel, socket)
    return subscription
  }
}

export default Subscription