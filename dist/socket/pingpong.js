"use strict";
// https://stackoverflow.com/questions/45928105/can-a-javascript-client-using-websockets-programatically-detect-ping-pong-activi
// https://github.com/websockets/ws/issues/675#issuecomment-195120612
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const message_1 = require("../message");
const Errors = require("./../errors");
/**
 * Plugin for echoing `ping` messages with `pong` responses
 */
class PingPong extends events.EventEmitter {
    constructor(socket) {
        super();
        this.socket = socket;
        this.socket.on('message', (message) => {
            if (message.type === 'ping') {
                return this.onPing(message).catch(this.onError.bind(this));
            }
        });
    }
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = new message_1.default('ping');
            try {
                yield this.socket.send(message, 'CLIENT_SERVER');
            }
            catch (error) {
                if (error instanceof Errors.ResponseTimeout) {
                    const err = new Errors.SocketNoPong();
                    throw err;
                    return;
                }
                throw error;
            }
            this.emit('pong');
        });
    }
    onPing(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('ping');
            const pongMessage = new message_1.default('pong', undefined, message.id);
            yield this.socket.send(pongMessage, 'PUSH');
        });
    }
    onError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`PingPong error: ${error.message}`);
            this.emit('error', error);
        });
    }
}
exports.default = PingPong;
//# sourceMappingURL=pingpong.js.map