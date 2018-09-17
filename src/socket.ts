import * as WS from 'isomorphic-ws'
import * as events from 'events'
import * as uuid from 'uuid'

import Message from './message'
import PingPong from './socket/pingpong'
import Heartbeat from './socket/heartbeat'
import * as Errors from './errors'

type Protocol = 'PUSH' | 'CLIENT_SERVER'
export { Protocol }

type SocketOptions = {
  responseTimeoutMs: number
  heartbeatIntervalMs: number
}

class Socket extends events.EventEmitter {
  private ws: WS
  
  public readonly pingpong: PingPong
  public readonly heartbeat: Heartbeat

  private responseTimeoutMs: number = 5000

  constructor(ws: WS, options: Partial<SocketOptions> = {}) {
    super()
    
    this.ws = ws
    this.pingpong = new PingPong(this)
    this.heartbeat = new Heartbeat(this, options.heartbeatIntervalMs)

    if (options && options.responseTimeoutMs) {
      this.responseTimeoutMs = options.responseTimeoutMs
    }
    
    this.bindSocketEventHandlers()
    this.bindHeartbeatEventHandlers()
  }

  public isAlive() {
    return this.heartbeat.isAlive()
  }

  public isOpen() {
    return this.ws.readyState === WS.OPEN
  }

  public static connect(address: string, options?: WS.ClientOptions) {
    const ws = new WS(address, options)
    const socket = new Socket(ws)
    return socket
  }

  public kill() {
    this.ws.close()
    this.emit('dead')
  }

  public send(message: Message, protocol: Protocol = 'PUSH'): Promise<Message | undefined> {
    if (!this.isAlive()) {
      throw new Errors.SocketIsDead()
    }
    if (!this.isOpen()) {
      throw new Errors.SocketNotOpened()
    }

    switch(protocol) {
      case 'CLIENT_SERVER': {
        message = message.with({
          id: uuid.v4()
        })
      }
    }

    return new Promise((resolve, reject) => {
      this.sendRaw(message, reject)

      switch(protocol) {
        case 'PUSH': {
          return resolve(undefined)
        }
        case 'CLIENT_SERVER': {
          const timeout = setTimeout(() => {
            const error = new Errors.ResponseTimeout(`Response timeout (${this.responseTimeoutMs}ms)`)
            reject(error)
          }, this.responseTimeoutMs)

          const self = this
          const callback = (response: Message) => {
            if (message.id !== response.id) {
              return
            }

            clearTimeout(timeout)
            self.removeListener('message', callback)

            resolve(response)
          }

          this.on('message', callback)
        }
      }
    })
  }

  private bindSocketEventHandlers() {
    this.ws.onopen = (event: any) => {
      this.emit('open')
    }

    this.ws.onerror = (event: {error: any, message: string, type: string}) => {
      this.emit('error', event.error)
    }

    this.ws.onclose = (event: { wasClean: boolean; code: number; reason: string }) => {
      this.emit('close', event.code, event.reason)
      this.kill()
    }

    this.ws.onmessage = (event: { data: any; type: string }) => {
      try {
        const message = this.receiveRaw(event.data)
        this.emit('message', message)
      } catch (error) {
        this.emit('error', error)
      }
    }
  }

  private bindHeartbeatEventHandlers() {
    this.heartbeat.on('dead', () => {
      this.kill()
    })
  }

  private receiveRaw(data: WS.Data) {
    const message = Message.fromJSON(data as string)
    return message
  }

  private sendRaw(message: Message, onError: (error: Error) => void) {
    const data = JSON.stringify(message)
    this.ws.send(data, {}, (err?: Error) => {
      if (err) {
        onError(err)
      }
    })
  }
}

export default Socket
