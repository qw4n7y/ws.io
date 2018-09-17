import Subscription from './../subscriptions/subscription';
import Message from './../message';
declare class Channel {
    readonly name: string;
    private subscriptions;
    constructor(name: string);
    getSubscriptions(): Subscription[];
    add(subscription: Subscription): void;
    remove(subscription: Subscription): void;
    broadcast(message: Message): Promise<void>;
    private bindSocketEventsHandlers;
}
export default Channel;
