import * as WS from 'isomorphic-ws'
import * as events from 'events'

import Socket from './socket'

class Server extends events.EventEmitter {

    private wss: WS.Server
    private sockets: Socket[] = []

    public listen(options: Partial<{host: string, port: number}>) {
        this.wss = new WS.Server({
            host: options.host || '0.0.0.0',
            port: options.port || 8000
        })

        this.wss.on('connection', this.onConnection.bind(this))
        this.wss.on('error', this.onError.bind(this))
    }

    private onConnection(ws: WS) {
        const socket = new Socket(ws)
        this.bindSocketEventHandlers(socket)
        
        this.sockets.push(socket)
        this.emit('connection', socket)
    }

    private onError(ws: WS, error: Error) {
        console.error(`Socket ${ws} error: ${JSON.stringify(error)}`)
        this.emit('error', error)
    }

    private bindSocketEventHandlers(socket: Socket) {
        socket.on('dead', () => {
            this.sockets = this.sockets.filter(s => s !== socket)
        })
    }
}

export default Server
