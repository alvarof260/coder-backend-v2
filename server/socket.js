import { Server } from 'socket.io'

const initializeSocket = (httpServer) => {
  const socketServer = new Server(httpServer)
  socketServer.on('connection', socketClient => {
    console.log('New Client connected')
    socketClient.on('listProductUpdate', (data) => {
      socketServer.emit('listProduct', data)
    })
  })
}

export default initializeSocket
