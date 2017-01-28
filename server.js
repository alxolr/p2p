const express = require('express');
const ExpressPeerServer = require('peer').ExpressPeerServer;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 8080;
let peerPool = [];
const sockets = [];

const peerMapping = {
};

const options = {
  // debug: true,
};

app.use(express.static('public'));
app.use('/api', ExpressPeerServer(server, options));

io.on('connection', (socket) => {
  sockets.push(socket);
  socket.on('peer', (peerId) => {
    peerMapping[socket] = peerId;
    const idx = peerPool.indexOf(peerId);
    if (idx === -1) {
      peerPool.push(peerId);
      sockets.forEach(so => so.emit('peerpool', peerPool));
    }
  });

  socket.on('peerpool', () => {
    socket.emit('peerpool', peerPool);
  });

  socket.on('disconnect', () => {
    const peerId = peerMapping[socket];
    const idx = peerPool.indexOf(peerId);
    if (idx !== -1) {
      peerPool = peerPool.splice(idx, 1);
      sockets.forEach(so => so.emit('peerpool', peerPool));
    }
    delete peerMapping[socket];
  });
});


server.listen(port, () => {
  console.log(`Server running http://localhost:${port}/`);
});
