/// <reference types="node" />
import * as events from 'events';
declare class Server extends events.EventEmitter {
    private wss;
    private sockets;
    listen(options: Partial<{
        host: string;
        port: number;
    }>): void;
    private onConnection;
    private onError;
    private bindSocketEventHandlers;
}
export default Server;
