// NOTE: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work

export class SocketIsDead extends Error { constructor(msg: any = null) { super(msg); Object.setPrototypeOf(this, SocketIsDead.prototype) } }
export class SocketNotOpened extends Error { constructor(msg: any = null) { super(msg); Object.setPrototypeOf(this, SocketNotOpened.prototype) } }
export class ResponseTimeout extends Error { constructor(msg: any = null) { super(msg); Object.setPrototypeOf(this, ResponseTimeout.prototype) } }
export class BizarreMessage extends Error { constructor(msg: any = null) { super(msg); Object.setPrototypeOf(this, BizarreMessage.prototype) } }
export class SocketNoPong extends Error { constructor(msg: any = null) { super(msg); Object.setPrototypeOf(this, SocketNoPong.prototype) } }