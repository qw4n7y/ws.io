"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
class Subscription extends events.EventEmitter {
    constructor(id, channel, socket) {
        super();
        this.id = id;
        this.channel = channel;
        this.socket = socket;
        this.bindSocketEventHandlers();
    }
    toJSON() {
        return {
            id: this.id,
            channel: this.channel
        };
    }
    static fromJSON(data, socket) {
        const subscription = new Subscription(data.id, data.channel, socket);
        return subscription;
    }
    bindSocketEventHandlers() {
        this.socket.on('dead', () => {
            this.emit('dead');
        });
    }
}
exports.default = Subscription;
//# sourceMappingURL=subscription.js.map