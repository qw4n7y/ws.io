import Socket from './../socket'
import Message from './../message'

jest.mock('ws')

describe('Socket', () => {

  describe('#send', () => {

    it('does not send messages when inactive', async (done) => {
      expect.assertions(1)

      const socket = new Socket("http://dummy");
      (socket as any).isActive = () => false

      try {
        socket.send(new Message('foo'))
      } catch(error) {
        expect(error.message).toMatch(/Socket is inactive/)
      }

      done()
    })

  })

})