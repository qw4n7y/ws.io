import Manager from './../manager'
import Message from './../../message'
import SockerMock from './../../__mocks__/socket'
import Subscription from '../../subscriptions/subscription';
import Channel from '../channel';

const channelName = 'BTC/USD'

describe('Channel Manager', () => {

  describe('#listen', () => {

    it('adds socket to listen to', async (done) => {
      const socket = new SockerMock()

      const manager = new Manager();
      (manager as any).reducer = jest.fn()

      manager.listen(socket as any)

      const message = new Message('hello', { foo: 'bar '})
      socket.emit('message', message)

      expect((manager as any).reducer).toHaveBeenCalledTimes(1)
      
      const [ reducerSocket, reducerMessage ] = (manager as any).reducer.mock.calls[0]
      expect(reducerSocket).toBe(socket)
      expect(reducerMessage.type).toEqual(message.type)
      expect(reducerMessage.payload).toEqual(message.payload)

      done()
    })

  })

  describe('#onSubscribe', () => {

    it('creates a new subscription and channel on subscribe', async (done) => {
      const socket = new SockerMock()
      const manager = new Manager()

      manager.listen(socket as any)

      const message = new Message('subscribe', { channel: channelName })
      socket.emit('message', message)

      const channels = manager.channels
      expect((Object as any).values(channels)).toHaveLength(1)

      const channel = channels[channelName]
      expect(channel).toBeDefined()

      const subscriptions = channel.getSubscriptions()
      expect(subscriptions).toHaveLength(1)

      const subscription = subscriptions[0]
      expect(subscription.socket).toBe(socket)
      expect(subscription.channel).toEqual(channelName)

      done()
    })

    it('fires exception on bizzare subscribe message', async (done) => {
      expect.assertions(1)
      
      const socket = new SockerMock()
      const manager = new Manager()

      manager.listen(socket as any)

      const message = new Message('subscribe', { weird: 'content' })

      try {
        socket.emit('message', message)
      } catch(error) {
        expect(error.message).toMatch(/Got bizzare subscribe request/)
      }

      done()
    })

  })

  describe('#onUnsubsribed', () => {
    
    it('removes the subscription on unsubsribe', async (done) => {
      const socket = new SockerMock()
      const manager = new Manager()

      manager.listen(socket as any)

      const subscription = new Subscription('123', channelName, socket as any)
      const channel = new Channel(channelName);
      (channel as any).subscriptions = [ subscription ];
      (manager as any).channels = {
        [channelName]: channel
      }

      const message = new Message('unsubscribe', { subscription: subscription.toJSON() })
      socket.emit('message', message)

      const channels = manager.channels
      expect((Object as any).values(channels)).toHaveLength(1)

      expect(channels[channelName]).toBeDefined()

      const subscriptions = channels[channelName].getSubscriptions()
      expect(subscriptions).toHaveLength(0)

      done()
    })

    it('fires exception on bizzare unsubscribe message', async (done) => {
      expect.assertions(1)
      
      const socket = new SockerMock()
      const manager = new Manager()

      manager.listen(socket as any)

      const message = new Message('unsubscribe', { weird: 'content' })

      try {
        socket.emit('message', message)
      } catch(error) {
        expect(error.message).toMatch(/Got bizzare unsubscribe request/)
      }

      done()
    })

  })

  describe('#getOrCreateChannel', () => {

    it('creates an new channel if not exists', async (done) => {
      const manager = new Manager()

      const notExistingChannelName = 'some_not_existing_channel'

      const channel = manager.getOrCreateChannel(notExistingChannelName)
      expect(channel).toBeDefined()
      expect(channel).toBeInstanceOf(Channel)
      expect(channel.name).toEqual(notExistingChannelName)
      expect(channel.getSubscriptions()).toHaveLength(0)

      done()
    })

  })

})