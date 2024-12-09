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

  // Unirse a una sala
  socket.on('join-room', (roomId) => {
    console.log(`Usuario ${socket.id} se unió a la sala ${roomId}`);
    socket.join(roomId);
  });

  // Reenviar oferta
  socket.on('offer', (data) => {
    const { roomId, offer } = data;
    socket.to(roomId).emit('offer', { offer });
  });

  // Reenviar respuesta
  socket.on('answer', (data) => {
    const { roomId, answer } = data;
    socket.to(roomId).emit('answer', { answer });
  });

  // Reenviar candidatos ICE
  socket.on('candidate', (data) => {
    const { roomId, candidate } = data;
    socket.to(roomId).emit('candidate', { candidate });
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor de señalización corriendo en http://localhost:3000');
});