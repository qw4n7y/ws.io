import * as WS from 'isomorphic-ws'
import * as events from 'events'
import * as uuid from 'uuid'

import Message from './message'

type Protocol = 'PUSH' | 'CLIENT_SERVER'
export { Protocol }

class Socket extends events.EventEmitter {
  private ws: WS
  private TIMEOUT_MS: number = 5000

  constructor(ws: WS) {
    super()
    this.ws = ws
    this.bindEventHandlers()
  }

  public static connect(address: string, options?: WS.ClientOptions) {
    const ws = new WS(address, options)
    const socket = new Socket(ws)
    return socket
  }

  public isActive() {
    return this.ws.readyState === WS.OPEN
  }

  private bindEventHandlers() {
    this.ws.onopen = (event: any) => {
      this.emit('open')
    }
    this.ws.onerror = (event: {error: any, message: string, type: string}) => {
      this.emit('error', event.error)
    }
    this.ws.onclose = (event: { wasClean: boolean; code: number; reason: string }) => {
      this.emit('close', event.code, event.reason)
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

  public send(message: Message, protocol: Protocol = 'PUSH'): Promise<Message | undefined> {
    if (!this.isActive()) {
      throw new Error(`Socket is inactive`)
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
            const error = Error(`Response timeout (${this.TIMEOUT_MS}ms)`)
            reject(error)
          }, this.TIMEOUT_MS)

          const callback = (response: Message) => {
            if (message.id !== response.id) {
              return
            }

            clearTimeout(timeout)
            // this.off('message', callback)

            resolve(response)
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
    this.ws.send(data, {}, (err?: Error) => {
      if (err) {
        onError(err)
      }
    })
  }
}

export default Socket