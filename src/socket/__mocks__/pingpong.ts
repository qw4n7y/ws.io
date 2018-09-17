import * as events from 'events'

class PingPong extends events.EventEmitter {
  constructor(socket: any) {
    super()
  }
}

export default PingPong