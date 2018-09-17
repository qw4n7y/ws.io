"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WS = require("isomorphic-ws");
const events = require("events");
const socket_1 = require("./socket");
class Server extends events.EventEmitter {
    constructor() {
        super(...arguments);
        this.sockets = [];
    }
    listen(options) {
        this.wss = new WS.Server({
            host: options.host || '0.0.0.0',
            port: options.port || 8000
        });
        this.wss.on('connection', this.onConnection.bind(this));
        this.wss.on('error', this.onError.bind(this));
    }
    onConnection(ws) {
        const socket = new socket_1.default(ws);
        this.bindSocketEventHandlers(socket);
        this.sockets.push(socket);
        this.emit('connection', socket);
    }
    onError(ws, error) {
        console.error(`Socket ${ws} error: ${JSON.stringify(error)}`);
        this.emit('error', error);
    }
    bindSocketEventHandlers(socket) {
        socket.on('dead', () => {
            this.sockets = this.sockets.filter(s => s !== socket);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map