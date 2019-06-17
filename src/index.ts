import Socket from './socket'
import Message from './message'
import Server from './server'
import Channel from './channels/channel'
import ChannelManager from './channels/manager'
import Subscription from './subscriptions/subscription'
import SubscriptionManager from './subscriptions/manager'
import * as Errors from './errors'

if (typeof window !== 'undefined') {
    (window as any).Socket = Socket;
    (window as any).Message = Message;
    (window as any).Server = Server;
    (window as any).Channel = Channel;
    (window as any).ChannelManager = ChannelManager;
    (window as any).Subscription = Subscription;
    (window as any).SubscriptionManager = SubscriptionManager;
}

export {
    Socket, Server, Channel, ChannelManager,
    Subscription, SubscriptionManager,
    Errors, Message
}