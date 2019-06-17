"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./socket");
exports.Socket = socket_1.default;
const message_1 = require("./message");
exports.Message = message_1.default;
const server_1 = require("./server");
exports.Server = server_1.default;
const channel_1 = require("./channels/channel");
exports.Channel = channel_1.default;
const manager_1 = require("./channels/manager");
exports.ChannelManager = manager_1.default;
const subscription_1 = require("./subscriptions/subscription");
exports.Subscription = subscription_1.default;
const manager_2 = require("./subscriptions/manager");
exports.SubscriptionManager = manager_2.default;
const Errors = require("./errors");
exports.Errors = Errors;
if (typeof window !== 'undefined') {
    window.Socket = socket_1.default;
    window.Message = message_1.default;
    window.Server = server_1.default;
    window.Channel = channel_1.default;
    window.ChannelManager = manager_1.default;
    window.Subscription = subscription_1.default;
    window.SubscriptionManager = manager_2.default;
}
//# sourceMappingURL=index.js.map