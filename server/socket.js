import { Server } from 'socket.io'

const initializeSocket = (httpServer, model) => {
  const socketServer = new Server(httpServer)
  socketServer.on('connection', socketClient => {
    console.log('New Client connected')
    socketClient.on('listProductUpdate', (data) => {
      console.log(data)
      socketServer.emit('listProduct', data)
    })
    socketClient.on('message', async data => {
      await model.create(data)
      const messages = await model.find()
      socketServer.emit('messages', messages)
    })
  })
}

export default initializeSocket
