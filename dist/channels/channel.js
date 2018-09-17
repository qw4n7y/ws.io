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
class Channel {
    constructor(name) {
        this.subscriptions = [];
        this.name = name;
    }
    getSubscriptions() {
        return this.subscriptions;
    }
    add(subscription) {
        if (this.subscriptions.indexOf(subscription) > -1) {
            return;
        }
        subscription.on('dead', () => {
            this.remove(subscription);
        });
        console.log(`Subscription ${subscription.id} was added to channel ${this.name}`);
        this.subscriptions.push(subscription);
    }
    remove(subscription) {
        console.log(`Subscription ${subscription.id} was removed from channel ${this.name}`);
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }
    broadcast(message) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let subscription of this.subscriptions) {
                if (!subscription.socket.isAlive()) {
                    continue;
                }
                if (!subscription.socket.isOpen()) {
                    continue;
                }
                const socketMessage = message.with({
                    subscriptionId: subscription.id
                });
                yield subscription.socket.send(socketMessage, 'PUSH');
            }
        });
    }
    bindSocketEventsHandlers() {
    }
}
exports.default = Channel;
//# sourceMappingURL=channel.js.map