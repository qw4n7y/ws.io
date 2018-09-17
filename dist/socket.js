"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WS = require("isomorphic-ws");
const events = require("events");
const uuid = require("uuid");
const message_1 = require("./message");
const pingpong_1 = require("./socket/pingpong");
const heartbeat_1 = require("./socket/heartbeat");
const Errors = require("./errors");
class Socket extends events.EventEmitter {
    constructor(ws, options = {}) {
        super();
        this.responseTimeoutMs = 5000;
        this.ws = ws;
        this.pingpong = new pingpong_1.default(this);
        this.heartbeat = new heartbeat_1.default(this, options.heartbeatIntervalMs);
        if (options && options.responseTimeoutMs) {
            this.responseTimeoutMs = options.responseTimeoutMs;
        }
        this.bindSocketEventHandlers();
        this.bindHeartbeatEventHandlers();
    }
    isAlive() {
        return this.heartbeat.isAlive();
    }
    isOpen() {
        return this.ws.readyState === WS.OPEN;
    }
    static connect(address, options) {
        const ws = new WS(address, options);
        const socket = new Socket(ws);
        return socket;
    }
    kill() {
        this.ws.close();
        this.emit('dead');
    }
    send(message, protocol = 'PUSH') {
        if (!this.isAlive()) {
            throw new Errors.SocketIsDead();
        }
        if (!this.isOpen()) {
            throw new Errors.SocketNotOpened();
        }
        switch (protocol) {
            case 'CLIENT_SERVER': {
                message = message.with({
                    id: uuid.v4()
                });
            }
        }
        return new Promise((resolve, reject) => {
            this.sendRaw(message, reject);
            switch (protocol) {
                case 'PUSH': {
                    return resolve(undefined);
                }
                case 'CLIENT_SERVER': {
                    const timeout = setTimeout(() => {
                        const error = new Errors.ResponseTimeout(`Response timeout (${this.responseTimeoutMs}ms)`);
                        reject(error);
                    }, this.responseTimeoutMs);
                    const self = this;
                    const callback = (response) => {
                        if (message.id !== response.id) {
                            return;
                        }
                        clearTimeout(timeout);
                        self.removeListener('message', callback);
                        resolve(response);
                    };
                    this.on('message', callback);
                }
            }
        });
    }
    bindSocketEventHandlers() {
        this.ws.onopen = (event) => {
            this.emit('open');
        };
        this.ws.onerror = (event) => {
            this.emit('error', event.error);
        };
        this.ws.onclose = (event) => {
            this.emit('close', event.code, event.reason);
            this.kill();
        };
        this.ws.onmessage = (event) => {
            try {
                const message = this.receiveRaw(event.data);
                this.emit('message', message);
            }
            catch (error) {
                this.emit('error', error);
            }
        };
    }
    bindHeartbeatEventHandlers() {
        this.heartbeat.on('dead', () => {
            this.kill();
        });
    }
    receiveRaw(data) {
        const message = message_1.default.fromJSON(data);
        return message;
    }
    sendRaw(message, onError) {
        const data = JSON.stringify(message);
        this.ws.send(data, {}, (err) => {
            if (err) {
                onError(err);
            }
        });
    }
}
exports.default = Socket;
//# sourceMappingURL=socket.js.map