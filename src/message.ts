import { SubscriptionId } from './subscriptions/subscription'

type MessageId = string
export { MessageId }

class Message {
  public readonly type: string
  public readonly payload: any
  public readonly id?: MessageId
  public readonly subscriptionId?: SubscriptionId

  constructor(type: string, payload?: any, id?: MessageId, subscriptionId?: SubscriptionId) {
    this.type = type
    this.payload = payload
    this.id = id
    this.subscriptionId = subscriptionId
  }

  public with(newId: MessageId) {
    const message = new Message(this.type, this.payload, newId, this.subscriptionId)
    return message
  }

  public static fromJSON(json: string) {
    const data = JSON.parse(json) as any
    const message = new Message(data.type, data.payload, data.id, data.subscriptionId)
    return message
  }
}

export default Message