const WebSocketClient = require('websocket').client;

const url = 'ws://192.168.227.90:5000/output';
const client = new WebSocketClient();

const sockets = [];
const peerPool = [];
const mapping = {};

function handleError(err) {
  console.log(err);
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    sockets.push(socket);
    socket.on('peer', (peerId) => {
      mapping[socket.id] = peerId;
      peerPool.push(peerId);
      sockets.forEach(so => so.emit('peerpool', peerPool));
    });

    socket.on('peerpool', () => {
      socket.emit('peerpool', peerPool);
    });

    socket.on('disconnect', () => {
      const peerId = mapping[socket.id];
      if (peerId) {
        const idx = peerPool.indexOf(peerId);
        if (idx !== -1) {
          peerPool.splice(idx, 1);
        }
      }
      sockets.forEach(so => so.emit('peerpool', peerPool));
      delete mapping[socket.id];
    });

    client.on('connectFailed', (error) => {
      handleError(error);
    });

    client.on('connect', (connection) => {
      connection.on('error', (error) => {
        handleError(error);
      });

      connection.on('close', () => { });
      connection.on('message', (message) => {
        console.log(message);
        if (Object.prototype.hasOwnProperty.call(message, 'utf8Data')) {
          const identifiers = JSON.parse(message);
          sockets.forEach(so => so.emit('users', identifiers));
        }
      });
    });

    client.connect(url);
  });
};
