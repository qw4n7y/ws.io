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
const Errors = require("./../errors");
/**
 * Plugin for checking if socket aliveness
 * Sends `ping` if there no messages were received during `intervalMs` period
 * Terminates the socket if there no any messages were received in 2 * `intervalMs` ms
 */
class Alive extends events.EventEmitter {
    constructor(socket, intervalMs) {
        super();
        this.alive = true;
        this.intervalMs = 10000;
        this.lastActivityAt = new Date();
        this.socket = socket;
        if (intervalMs) {
            this.intervalMs = intervalMs;
        }
        this.interval = setInterval(() => {
            this.checkIsAlive().catch(this.onError.bind(this));
        }, this.intervalMs);
        this.socket.on('message', this.trackLastActivity.bind(this));
        this.socket.pingpong.on('ping', this.trackLastActivity.bind(this));
        this.socket.pingpong.on('pong', this.trackLastActivity.bind(this));
    }
    isAlive() {
        return this.alive;
    }
    trackLastActivity() {
        this.lastActivityAt = new Date();
    }
    checkIsAlive() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = (new Date).getTime();
            const lastActivityAtMsAgo = now - this.lastActivityAt.getTime();
            if (lastActivityAtMsAgo > 3 * this.intervalMs) {
                console.log(`HEARTBEAT: lastActivityAtMsAgo = ${lastActivityAtMsAgo}`);
                this.kill();
                return;
            }
            if (lastActivityAtMsAgo > this.intervalMs) {
                try {
                    yield this.socket.pingpong.ping();
                }
                catch (error) {
                    if (error instanceof Errors.SocketIsDead) {
                        console.log('Heartbeat: SocketIsDead');
                        return;
                    }
                    if (error instanceof Errors.SocketNoPong) {
                        console.log('Heartbeat: SocketNoPong');
                        this.kill();
                        return;
                    }
                    if (error instanceof Errors.SocketNotOpened) {
                        console.log('Heartbeat: SocketNotOpened');
                        this.kill();
                        return;
                    }
                    throw error;
                }
                return;
            }
        });
    }
    kill() {
        this.alive = false;
        clearInterval(this.interval);
        this.emit('dead');
    }
    onError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`Heartbeat error: ${error.message}`);
            this.emit('error', error);
        });
    }
}
exports.default = Alive;
//# sourceMappingURL=heartbeat.js.map