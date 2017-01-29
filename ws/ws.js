const sockets = [];
const peerPool = [];
const mapping = {};

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
