const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:4200', // Reemplaza con la URL de tu cliente Angular
  methods: ['GET', 'POST']
}));

const server = http.createServer(app);

// Configurar Socket.io con CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu cliente Angular
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('offer', (offer) => {
      console.log('Received offer');  // Log when offer is received
      socket.broadcast.emit('offer', offer);  // Broadcast the offer to all other connected clients
  });

  socket.on('answer', (answer) => {
      console.log('Received answer');  // Log when answer is received
      socket.broadcast.emit('answer', answer);  // Broadcast the answer back to the caller
  });

  socket.on('candidate', (candidate) => {
      console.log('Received candidate');  // Log when candidate is received
      socket.broadcast.emit('candidate', candidate);  // Broadcast candidate to the other peer
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Servidor de señalización corriendo en http://localhost:3000');
});