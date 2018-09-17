/// <reference types="node" />
import * as events from 'events';
import Socket from './../socket';
declare type SubscriptionId = string;
export { SubscriptionId };
declare class Subscription extends events.EventEmitter {
    readonly id: SubscriptionId;
    readonly channel: string;
    readonly socket: Socket;
    constructor(id: SubscriptionId, channel: string, socket: Socket);
    toJSON(): {
        id: string;
        channel: string;
    };
    static fromJSON(data: any, socket: Socket): Subscription;
    private bindSocketEventHandlers;
}
export default Subscription;
