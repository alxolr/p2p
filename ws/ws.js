const WebSocketClient = require('websocket').client;
const config = require('config');

const client = new WebSocketClient();

const sockets = [];
const peerPool = [];
const mapping = {};
const cache = {};

function handleError(err) {
  console.log(err);
}

client.on('connectFailed', (error) => {
  handleError(error);
});

client.on('connect', (connection) => {
  connection.on('error', (error) => {
    handleError(error);
  });

  connection.on('close', () => { });
  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      const identifiers = JSON.parse(message.utf8Data);
      console.log(identifiers);

      identifiers.forEach((identifier) => {
        if (cache[identifier.Identifier] !== identifier.CellId) {
          cache[identifier.Identifier] = identifier.CellId;
          sockets.forEach(so => so.emit('users', identifier));
        }
      });
    }
    // if (Object.prototype.hasOwnProperty.call(message, 'utf8Data')) {
      // const identifiers = JSON.parse(message.utf8Data);
      // console.log(identifiers);
      // sockets.forEach(so => so.emit('users', identifiers));
    // }
  });
});

client.connect(config.output);


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
  });
};
