// https://stackoverflow.com/questions/45928105/can-a-javascript-client-using-websockets-programatically-detect-ping-pong-activi
// https://github.com/websockets/ws/issues/675#issuecomment-195120612

import * as events from 'events'

import Socket from './../socket'
import * as Errors from './../errors'

/**
 * Plugin for checking if socket aliveness
 * Sends `ping` if there no messages were received during `intervalMs` period
 * Terminates the socket if there no any messages were received in 2 * `intervalMs` ms
 */
class Alive extends events.EventEmitter {
  private socket: Socket
  private alive: boolean = true

  private intervalMs: number = 10000
  private interval: any // NodeJS.Timer

  private lastActivityAt: Date = new Date()

  constructor(socket: Socket, intervalMs?: number) {
    super()
    this.socket = socket

    if (intervalMs) { this.intervalMs = intervalMs }
    this.interval = setInterval(() => {
      this.checkIsAlive().catch(this.onError.bind(this))
    }, this.intervalMs)

    this.socket.on('message', this.trackLastActivity.bind(this))
    this.socket.pingpong.on('ping', this.trackLastActivity.bind(this))
    this.socket.pingpong.on('pong', this.trackLastActivity.bind(this))
  }

  public isAlive() {
    return this.alive
  }

  private trackLastActivity() {
    this.lastActivityAt = new Date()
  }

  private async checkIsAlive() {
    const now = (new Date).getTime()
    const lastActivityAtMsAgo = now - this.lastActivityAt.getTime()
    
    if (lastActivityAtMsAgo > 3 * this.intervalMs) {
      console.log(`HEARTBEAT: lastActivityAtMsAgo = ${lastActivityAtMsAgo}`)
      this.kill()
      return
    }

    if (lastActivityAtMsAgo > this.intervalMs) {
      try {
        await this.socket.pingpong.ping()
      } catch(error) {
        if (error instanceof Errors.SocketIsDead) {
          console.log('Heartbeat: SocketIsDead')
          return
        }
        if (error instanceof Errors.SocketNoPong) {
          console.log('Heartbeat: SocketNoPong')
          this.kill()
          return
        }
        if (error instanceof Errors.SocketNotOpened) {
          console.log('Heartbeat: SocketNotOpened')
          this.kill()
          return
        }

        throw error
      }
      
      return
    }
  }

  private kill() {
    this.alive = false
    clearInterval(this.interval)
    this.emit('dead')
  }

  private async onError(error: Error) {
    console.error(`Heartbeat error: ${error.message}`)
    this.emit('error', error)
  }
}

export default Alive