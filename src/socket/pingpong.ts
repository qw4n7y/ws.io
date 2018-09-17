// https://stackoverflow.com/questions/45928105/can-a-javascript-client-using-websockets-programatically-detect-ping-pong-activi
// https://github.com/websockets/ws/issues/675#issuecomment-195120612

import * as events from 'events'

import Socket from '../socket'
import Message from '../message'
import * as Errors from './../errors'

/**
 * Plugin for echoing `ping` messages with `pong` responses
 */
class PingPong extends events.EventEmitter {
  private socket: Socket

  constructor(socket: Socket) {
    super()
    this.socket = socket

    this.socket.on('message', (message: Message) => {
      if (message.type === 'ping') {
        return this.onPing(message).catch(this.onError.bind(this))
      }
    })
  }

  public async ping() {
    const message = new Message('ping')

    try {
      await this.socket.send(message, 'CLIENT_SERVER')
    } catch(error) {
      if (error instanceof Errors.ResponseTimeout) {
        const err = new Errors.SocketNoPong()
        throw err
        return
      }
      throw error
    }
    
    this.emit('pong')
  }

  private async onPing(message: Message) {
    this.emit('ping')
    const pongMessage = new Message('pong', undefined, message.id)
    await this.socket.send(pongMessage, 'PUSH')
  }

  private async onError(error: Error) {
    console.error(`PingPong error: ${error.message}`)
    this.emit('error', error)
  }
}

export default PingPong