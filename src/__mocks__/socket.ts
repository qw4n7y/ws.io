import * as events from 'events'
import * as uuid from 'uuid'

import Message from './../message'
import { Protocol } from './../socket'

import HearbeatMock from './../socket/__mocks__/heartbeat'
import PingPongMock from './../socket/__mocks__/pingpong'

type ResponseMock = Message | Error

const DEFAULT_RESPONSE = new Message('echo')

class SocketMock extends events.EventEmitter {
  private responses: ResponseMock[] = []
  private currentResponse = 0
  private defaultResponse: ResponseMock

  public readonly heartbeat = new HearbeatMock(null)
  public readonly pingpong = new PingPongMock(null)

  public send: jest.Mock<{}>

  constructor(responses: ResponseMock[] = [], defaultResponse?: ResponseMock) {
    super()

    this.responses = responses
    this.defaultResponse = defaultResponse || DEFAULT_RESPONSE
    this.send = jest.fn(this.__send__.bind(this))
  }

  public isAlive() {
    return true
  }

  public isOpen() {
    return true
  }

  __send__(message: Message, protocol: Protocol) {
    switch(protocol) {
      case 'CLIENT_SERVER': {
        message = message.with({
          id: uuid.v4()
        })
      }
    }

    let response: ResponseMock

    if (this.currentResponse >= this.responses.length) {
      response = this.defaultResponse
    } else {
      response = this.responses[this.currentResponse]
      this.currentResponse += 1
    }

    if (response instanceof Error) {
      throw response
    }

    if (protocol === 'CLIENT_SERVER') {
      response = response.with({
        id: message.id
      })
    }

    return Promise.resolve(response)
  }
}

export default SocketMock
