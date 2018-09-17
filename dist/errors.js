"use strict";
// NOTE: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
Object.defineProperty(exports, "__esModule", { value: true });
class SocketIsDead extends Error {
    constructor(msg = null) { super(msg); Object.setPrototypeOf(this, SocketIsDead.prototype); }
}
exports.SocketIsDead = SocketIsDead;
class SocketNotOpened extends Error {
    constructor(msg = null) { super(msg); Object.setPrototypeOf(this, SocketNotOpened.prototype); }
}
exports.SocketNotOpened = SocketNotOpened;
class ResponseTimeout extends Error {
    constructor(msg = null) { super(msg); Object.setPrototypeOf(this, ResponseTimeout.prototype); }
}
exports.ResponseTimeout = ResponseTimeout;
class BizarreMessage extends Error {
    constructor(msg = null) { super(msg); Object.setPrototypeOf(this, BizarreMessage.prototype); }
}
exports.BizarreMessage = BizarreMessage;
class SocketNoPong extends Error {
    constructor(msg = null) { super(msg); Object.setPrototypeOf(this, SocketNoPong.prototype); }
}
exports.SocketNoPong = SocketNoPong;
//# sourceMappingURL=errors.js.map