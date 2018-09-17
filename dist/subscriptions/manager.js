"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_1 = require("./subscription");
const message_1 = require("../message");
const Errors = require("../errors");
class Manager {
    constructor(socket) {
        this.subscriptions = [];
        this.socket = socket;
        socket.on('message', this.onMessage.bind(this));
    }
    getSubscriptions() {
        return this.subscriptions;
    }
    onMessage(message) {
        const subscriptionId = message.subscriptionId;
        if (!subscriptionId) {
            return;
        }
        const subscription = this.subscriptions.find(s => s.id === subscriptionId);
        if (!subscription) {
            return;
        }
        subscription.emit('message', message);
    }
    subscribe(channel) {
        const message = new message_1.default('subscribe', { channel });
        const existingSubscription = this.subscriptions.find(s => s.channel === channel);
        if (existingSubscription) {
            return Promise.resolve(existingSubscription);
        }
        return this.socket.send(message, 'CLIENT_SERVER').then((response) => {
            let invalid = response.type !== 'subscribed' || !response.payload || !response.payload.subscription;
            if (invalid) {
                const error = new Errors.BizarreMessage(JSON.stringify(response));
                throw error;
            }
            const subscription = subscription_1.default.fromJSON(response.payload.subscription, this.socket);
            this.subscriptions.push(subscription);
            return subscription;
        });
    }
    unsubscribe(subscription) {
        const message = new message_1.default('unsubscribe', {
            subscription: subscription.toJSON()
        });
        return this.socket.send(message, 'CLIENT_SERVER').then((response) => {
            let invalid = response.type !== 'unsubscribed' || !response.payload || !response.payload.subscription;
            if (invalid) {
                const error = new Errors.BizarreMessage(JSON.stringify(response));
                throw error;
            }
            const serverSubscription = subscription_1.default.fromJSON(response.payload.subscription, this.socket);
            if (serverSubscription.id !== subscription.id) {
                const error = new Errors.BizarreMessage(`Desync: ${JSON.stringify(serverSubscription)} on server, ${JSON.stringify(subscription)} on client`);
                throw error;
            }
            this.subscriptions = this.subscriptions.filter(s => s.id !== subscription.id);
            return true;
        });
    }
}
exports.default = Manager;
//# sourceMappingURL=manager.js.map