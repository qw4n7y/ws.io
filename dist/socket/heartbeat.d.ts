/// <reference types="node" />
import * as events from 'events';
import Socket from './../socket';
/**
 * Plugin for checking if socket aliveness
 * Sends `ping` if there no messages were received during `intervalMs` period
 * Terminates the socket if there no any messages were received in 2 * `intervalMs` ms
 */
declare class Alive extends events.EventEmitter {
    private socket;
    private alive;
    private intervalMs;
    private interval;
    private lastActivityAt;
    constructor(socket: Socket, intervalMs?: number);
    isAlive(): boolean;
    private trackLastActivity;
    private checkIsAlive;
    private kill;
    private onError;
}
export default Alive;
