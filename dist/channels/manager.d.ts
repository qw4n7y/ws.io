import Channel from './channel';
import Socket from '../socket';
declare class Manager {
    readonly channels: {
        [key: string]: Channel;
    };
    listen(socket: Socket): void;
    getOrCreateChannel(channelName: string): Channel;
    private onMessage;
    private reducer;
    private onSubscribe;
    private onUnsubscribe;
}
export default Manager;
