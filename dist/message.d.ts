import { SubscriptionId } from './subscriptions/subscription';
declare type MessageId = string;
export { MessageId };
declare class Message {
    readonly type: string;
    readonly payload: any;
    readonly id?: MessageId;
    readonly subscriptionId?: SubscriptionId;
    constructor(type: string, payload?: any, id?: MessageId, subscriptionId?: SubscriptionId);
    with(props: Partial<{
        id: MessageId;
        subscriptionId: SubscriptionId;
    }>): Message;
    static fromJSON(json: string): Message;
}
export default Message;
