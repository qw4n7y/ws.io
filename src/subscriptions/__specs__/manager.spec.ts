import Manager from './../manager'
import Subscription from './../subscription'
import Message from './../../message'
import SocketMock from './../../__mocks__/socket'
import * as Errors from '../../errors'

jest.mock('./../../socket.ts')

const channel = 'BTC/USD'

describe('Subscription Manager', () => {

  describe('subscribe', () => {
    it ('subscribes socket to channel', async (done) => {
      const socket = new SocketMock([
        new Message('subscribed', { subscription: { id: '123', channel } })
      ])
      const manager = new Manager(socket as any)
  
      const subscription = await manager.subscribe(channel)
  
      expect(subscription).toBeInstanceOf(Subscription)
      expect(subscription.id).toEqual('123')
      expect(subscription.channel).toEqual(channel)
  
      expect((socket as any).send).toHaveBeenCalledTimes(1)
  
      const [message, protocol] = ((socket as any).send).mock.calls[0]

      expect(message.type).toEqual('subscribe')
      expect(message.payload).toEqual({ channel })
      expect(protocol).toEqual('CLIENT_SERVER')
  
      done()
    })

    it ('fires exception on message not being delivered', async (done) => {
      expect.assertions(1)

      const socket = new SocketMock([
        new Error('My dummy error')
      ])
      const manager = new Manager(socket as any)
  
      try {
        await manager.subscribe(channel)
      } catch (error) {
        expect(error.message).toEqual('My dummy error')
      }
  
      done()
    })

    it ('fires exception on getting bizarre response', async (done) => {
      expect.assertions(1)

      const socket = new SocketMock([
        new Message('weird', { subscription: { id: '123', channel } })
      ])
      const manager = new Manager(socket as any)
  
      try {
        await manager.subscribe(channel)
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.BizarreMessage)
      }
  
      done()
    })

    it ('does not creates a new subscription if already subscribed', async (done) => {
      const socket = new SocketMock([
        new Message('subscribed', { subscription: { id: '123', channel } })
      ])
      const manager = new Manager(socket as any)
  
      const subscription = await manager.subscribe(channel)
      expect(subscription).toBeInstanceOf(Subscription)
      
      const subscription2 = await manager.subscribe(channel)

      expect(subscription).toBe(subscription2)
      const subscriptions = manager.getSubscriptions()
      expect(subscriptions).toHaveLength(1)
  
      done()
    })
  })

  describe('on message', () => {
    it('it emits subscription\'s event', async (done) => {
      const subscriptionId = '123'

      const socket = new SocketMock([
        new Message('subscribed', { subscription: { id: subscriptionId, channel } })
      ])

      const messages = [
        new Message('hello', {}, undefined, subscriptionId),
        new Message('hello2', { foo: 'bar' }, null, subscriptionId),
        new Message('hello3', { foo: 'bar' }),
        new Message('hello4', { foo: 'bar' })
      ]

      let subscriptionMessages = [] as Message[]

      const manager = new Manager(socket as any);
      manager.subscribe(channel).then(subscription => {

        subscription.on('message', (message: Message) => {
          subscriptionMessages.push(message)
        })

        for(let message of messages) {
          socket.emit('message', message)
        }

        // return new Promise((res, rej) => setTimeout(res, 100))
      }).then(() => {
        expect(subscriptionMessages).toHaveLength(2)

        done()
      })
    })
  })

  describe('unsubscribe', () => {
    it ('unsubscribes socket from channel', async (done) => {
      const socket = new SocketMock([
        new Message('subscribed', { subscription: { id: '123', channel } }),
        new Message('unsubscribed', { subscription: { id: '123', channel } })
      ])
      
      const manager = new Manager(socket as any)
      const subscription = await manager.subscribe(channel)

      expect(subscription.id).toEqual('123')
      expect((socket as any).send).toHaveBeenCalledTimes(1)

      await manager.unsubscribe(subscription)

      expect((socket as any).send).toHaveBeenCalledTimes(2)
      const [message, protocol] = (socket as any).send.mock.calls[1]

      expect(message.type).toEqual('unsubscribe')
      expect(message.payload).toEqual({ subscription: { id: '123', channel } })

      expect(protocol).toEqual('CLIENT_SERVER')
  
      done()
    })

    it ('fires exception on message not being delivered', async (done) => {
      expect.assertions(1)

      const socket = new SocketMock([
        new Error('My dummy error')
      ])
      
      const manager = new Manager(socket as any)
      const subscription = new Subscription('123', channel, socket as any)
  
      try {
        await manager.unsubscribe(subscription)
      } catch (error) {
        expect(error.message).toEqual('My dummy error')
      }
  
      done()
    })

    it ('fires exception on getting bizarre response', async (done) => {
      expect.assertions(1)

      const socket = new SocketMock([
        new Message('weird', { foo: 'bar' })
      ])
      
      const manager = new Manager(socket as any)
      const subscription = new Subscription('123', channel, socket as any)
  
      try {
        await manager.unsubscribe(subscription)
      } catch (error) {
        expect(error).toBeInstanceOf(Errors.BizarreMessage)
      }
  
      done()
    })

  })

})