import Socket from './../socket'
import Message from './../message'
import * as Errors from './../errors'

jest.mock('ws')

describe('Socket', () => {

  describe('#send', () => {

    it('does not send messages when inactive', async (done) => {
      expect.assertions(1)

      const socket = Socket.connect("http://dummy");
      (socket as any).isAlive = () => false

      try {
        socket.send(new Message('foo'))
      } catch(error) {
        expect(error).toBeInstanceOf(Errors.SocketIsDead)
      }

      done()
    })

  })

})