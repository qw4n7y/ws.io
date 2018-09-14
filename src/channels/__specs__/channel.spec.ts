import Channel from './../channel'
import Message from './../../message'
import Subscription from './../../subscriptions/subscription'
import SocketMock from './../../__mocks__/socket'

const channelName = 'BTC/USD'

describe('Channel', () => {

  describe('#broadcast', () => {
    it ('broadcasts the message', async (done) => {
      const socketA = new SocketMock()
      const socketB = new SocketMock()

      const subscriptionA = new Subscription('123', channelName, socketA as any)
      const subscriptionB = new Subscription('123', channelName, socketB as any)

      const channel = new Channel(channelName)
      channel.add(subscriptionA)
      channel.add(subscriptionB)

      const message = new Message('hello', { foo: 'bar' })

      await channel.broadcast(message)

      expect(socketA.send).toHaveBeenCalledTimes(1)
      const [socketAmessage, protocolA] = socketA.send.mock.calls[0]
      expect(protocolA).toEqual('PUSH')
      expect(socketAmessage.subscriptionId).toEqual(subscriptionA.id)
      expect(socketAmessage.type).toEqual('hello')
      expect(socketAmessage.payload).toEqual({ foo: 'bar' })

      expect(socketB.send).toHaveBeenCalledTimes(1)
      const [socketBmessage, protocolB] = socketB.send.mock.calls[0]
      expect(protocolB).toEqual('PUSH')
      expect(socketBmessage.subscriptionId).toEqual(subscriptionA.id)
      expect(socketBmessage.type).toEqual('hello')
      expect(socketBmessage.payload).toEqual({ foo: 'bar' })

      done()
    })

  })

})