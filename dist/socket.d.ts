/// <reference types="ws" />
/// <reference types="node" />
import * as WS from 'isomorphic-ws';
import * as events from 'events';
import Message from './message';
import PingPong from './socket/pingpong';
import Heartbeat from './socket/heartbeat';
declare type Protocol = 'PUSH' | 'CLIENT_SERVER';
export { Protocol };
declare type SocketOptions = {
    responseTimeoutMs: number;
    heartbeatIntervalMs: number;
};
declare class Socket extends events.EventEmitter {
    private ws;
    readonly pingpong: PingPong;
    readonly heartbeat: Heartbeat;
    private responseTimeoutMs;
    constructor(ws: WS, options?: Partial<SocketOptions>);
    isAlive(): boolean;
    isOpen(): boolean;
    static connect(address: string, options?: WS.ClientOptions): Socket;
    kill(): void;
    send(message: Message, protocol?: Protocol): Promise<Message | undefined>;
    private bindSocketEventHandlers;
    private bindHeartbeatEventHandlers;
    private receiveRaw;
    private sendRaw;
}
export default Socket;
