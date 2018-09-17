"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(type, payload, id, subscriptionId) {
        this.type = type;
        this.payload = payload;
        this.id = id;
        this.subscriptionId = subscriptionId;
    }
    with(props) {
        const newId = props.id ? props.id : this.id;
        const newSubscriptionId = props.subscriptionId ? props.subscriptionId : this.subscriptionId;
        const message = new Message(this.type, this.payload, newId, newSubscriptionId);
        return message;
    }
    static fromJSON(json) {
        const data = JSON.parse(json);
        const message = new Message(data.type, data.payload, data.id, data.subscriptionId);
        return message;
    }
}
exports.default = Message;
//# sourceMappingURL=message.js.map