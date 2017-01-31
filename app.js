const express = require('express');
const WebSocketClient = require('websocket').client;

const app = express();
const url = 'ws://192.168.227.90:5000/output';

const client = new WebSocketClient();

function handleError(err) {
  console.error(err);
}

client.on('connectFailed', (error) => {
  handleError(error);
});

client.on('connect', (connection) => {
  console.log('Connection started');
  connection.on('error', (error) => {
    handleError(error);
  });
  connection.on('close', () => { });
  connection.on('message', (message) => {
    console.log(JSON.parse(message.utf8Data));
  });
});

client.connect(url);

app.listen(8181);
