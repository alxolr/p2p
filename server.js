const express = require('express');
const ExpressPeerServer = require('peer').ExpressPeerServer;
const ws = require('./ws/ws');
const routes = require('./routes/app');
const config = require('config');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || config.port || 8080;

const options = {
  // debug: true,
};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/api', ExpressPeerServer(server, options));
ws(io);
app.use(routes);

server.listen(port, () => {
  console.log(`Server running http://localhost:${port}/`);
});
