const sockets = [];
const peerPool = [];
const peerMapping = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    sockets.push(socket);
    socket.on('peer', (peerId) => {
      peerMapping[socket] = peerId;
      peerPool.push(peerId);
      sockets.forEach(so => so.emit('peerpool', peerPool));
    });

    socket.on('peerpool', () => {
      socket.emit('peerpool', peerPool);
    });

    socket.on('disconnect', () => {
      // const peerId = peerMapping[socket];
      // console.log(peerId, peerPool);
      // const idx = peerPool.indexOf(peerId);
      // console.log(idx);
      // if (idx !== -1) {
      // peerPool.slice(idx, 1);
      // sockets.forEach(so => so.emit('peerpool', peerPool));
      // }
      // delete peerMapping[socket];
    });
  });
};
