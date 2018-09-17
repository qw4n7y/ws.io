import * as events from 'events'

class AliveMock extends events.EventEmitter {
  constructor(socket: any, intervalMs?: number) {
    super()
  }

  public isAlive() {
    return true
  }
}

export default AliveMock