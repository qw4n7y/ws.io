import * as WS from 'ws'
import * as events from 'events'
import * as uuid from 'uuid'

import Message from './message'

type Protocol = 'PUSH' | 'CLIENT_SERVER'
export { Protocol }

class Socket extends events.EventEmitter {
  private ws: WS
  private TIMEOUT_MS: number = 5000

  constructor(address: string, options?: WS.ClientOptions) {
    super()
    this.ws = new WS(address, options)
    this.bindEventHandlers()
  }

  public isActive() {
    return this.ws.readyState === WS.OPEN
  }

  private bindEventHandlers() {
    this.ws.on('close', (ws: WS, code: number, reason: string) => {
      this.ws.terminate()
      this.emit('close', code, reason)
    })
    this.ws.on('error', (ws: WS, error: Error) => {
      this.emit('error', error)
    })
    this.ws.on('open', (ws: WS) => {
      this.emit('open')
    })
    this.ws.on('message', (ws: WS, data: WS.Data) => {
      try {
        const message = this.receiveRaw(data)
        this.emit('message', message)
      } catch (error) {
        this.emit('error', error)
      }
    })
  }

  public send(message: Message, protocol: Protocol = 'PUSH'): Promise<Message | undefined> {
    if (!this.isActive()) {
      throw new Error(`Socket is inactive`)
    }

    switch(protocol) {
      case 'CLIENT_SERVER': {
        const newId = uuid.v4()
        message = message.with(newId)
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
            const error = Error(`Response timeout (${this.TIMEOUT_MS}ms)`)
            reject(error)
          }, this.TIMEOUT_MS)

          const callback = (response: Message) => {
            if (message.id === response.id) {
              clearTimeout(timeout)
              this.off('message', callback)

              resolve(response)
            }
          }
  
          this.on('message', callback)
        }
      }
    })
  }

  private receiveRaw(data: WS.Data) {
    const message = Message.fromJSON(data as string)
    return message
  }

  private sendRaw(message: Message, onError: (error: Error) => void) {
    const data = JSON.stringify(message)
    this.ws.send(data, {
      binary: true
    }, (err?: Error) => {
      if (err) {
        onError(err)
      }
    })
  }
}

export default Socket