/// <reference types="node" />
import * as events from 'events';
import Socket from '../socket';
/**
 * Plugin for echoing `ping` messages with `pong` responses
 */
declare class PingPong extends events.EventEmitter {
    private socket;
    constructor(socket: Socket);
    ping(): Promise<void>;
    private onPing;
    private onError;
}
export default PingPong;
