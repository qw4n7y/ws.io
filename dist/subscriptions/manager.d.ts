import Socket from '../socket';
import Subscription from './subscription';
declare class Manager {
    private socket;
    private subscriptions;
    constructor(socket: Socket);
    getSubscriptions(): Subscription[];
    private onMessage;
    subscribe(channel: string): Promise<Subscription>;
    unsubscribe(subscription: Subscription): Promise<boolean>;
}
export default Manager;
