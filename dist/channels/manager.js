"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const channel_1 = require("./channel");
const subscription_1 = require("./../subscriptions/subscription");
const message_1 = require("../message");
const Errors = require("../errors");
class Manager {
    constructor() {
        this.channels = {};
    }
    listen(socket) {
        socket.on('message', this.onMessage.bind(this, socket));
    }
    getOrCreateChannel(channelName) {
        let channel = this.channels[channelName];
        if (!channel) {
            channel = new channel_1.default(channelName);
            this.channels[channelName] = channel;
        }
        return channel;
    }
    onMessage(socket, message) {
        this.reducer(socket, message)
            .catch((error) => {
            console.error(`Reducer: error ${error} handling ${message}`);
        });
    }
    reducer(socket, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.type === 'subscribe') {
                yield this.onSubscribe(socket, message);
                return;
            }
            if (message.type === 'unsubscribe') {
                yield this.onUnsubscribe(socket, message);
                return;
            }
        });
    }
    onSubscribe(socket, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let invalid = !message.payload || !message.payload.channel;
            if (invalid) {
                const error = new Errors.BizarreMessage(JSON.stringify(message));
                throw error;
            }
            const channelName = message.payload.channel;
            let channel = this.channels[channelName];
            if (!channel) {
                channel = new channel_1.default(channelName);
                this.channels[channelName] = channel;
            }
            const subscriptions = channel.getSubscriptions();
            let subscription = subscriptions.find(s => s.socket === socket);
            if (!subscription) {
                const newId = uuid.v4();
                subscription = new subscription_1.default(newId, channelName, socket);
            }
            channel.add(subscription);
            // Send ack
            const ackMessage = new message_1.default('subscribed', {
                subscription: subscription.toJSON()
            }, message.id);
            yield socket.send(ackMessage, 'PUSH');
        });
    }
    onUnsubscribe(socket, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let invalid = !message.payload || !message.payload.subscription;
            if (invalid) {
                const error = new Errors.BizarreMessage(JSON.stringify(message));
                throw error;
            }
            const clientSubscription = subscription_1.default.fromJSON(message.payload.subscription, socket);
            let channel = this.channels[clientSubscription.channel];
            if (!channel) {
                return;
            }
            const subscriptions = channel.getSubscriptions();
            let subscription = subscriptions.find(s => s.id === clientSubscription.id);
            if (!subscription) {
                return;
            }
            channel.remove(subscription);
            // Send ack
            const ackMessage = new message_1.default('unsubscribed', {
                subscription: subscription.toJSON()
            }, message.id);
            yield socket.send(ackMessage, 'PUSH');
        });
    }
}
exports.default = Manager;
//# sourceMappingURL=manager.js.map