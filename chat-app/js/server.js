const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public'))); // 정적 파일 경로

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (socket) => {
  let username = null;

  socket.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'login') {
      username = data.username;
      clients.set(socket, username);
      broadcastUserList();
    }

    else if (data.type === 'message') {
      const broadcastMessage = JSON.stringify({
        type: 'message',
        username: data.username,
        text: data.text,
        messageId: data.messageId, // ✅ 메시지 ID 포함
      });

      for (let [client] of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage);
        }
      }
    }

    else if (data.type === 'read') {
      const readMessage = JSON.stringify({
        type: 'read',
        messageId: data.messageId,
        reader: username, // 읽은 사용자의 이름 추가
      });

      for (let [client, name] of clients) {
        if (name === data.toUsername && client.readyState === WebSocket.OPEN) {
          client.send(readMessage); // 메시지 보낸 상대에게만 전달
        }
      }
    }

    else if (data.type === 'file') {
      const fileMessage = JSON.stringify({
        type: 'file',
        username: data.username,
        fileName: data.fileName,
        fileData: data.fileData,
      });

      for (let [client] of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(fileMessage);
        }
      }
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    broadcastUserList();
  });

  function broadcastUserList() {
    const userList = Array.from(clients.values());
    const userListMessage = JSON.stringify({
      type: 'userList',
      users: userList,
    });

    for (let [client] of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(userListMessage);
      }
    }
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
