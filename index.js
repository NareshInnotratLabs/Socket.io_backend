const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "*", // Frontend URL
      methods: ["GET", "POST"],
    }
});
// Dummy data for demonstration
const videoLinks = [

        'https://res.cloudinary.com/dipn71lt0/video/upload/v1716052854/lmndkrpc3webohoqdmab.mp4',
        'https://res.cloudinary.com/dpfcfb009/video/upload/v1715951502/satya/b0ig0zkopobyhf4oqypw.mp4',
      
  ];
let currentVideoIndex = 0;

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send the current video link to the client
  socket.on('initialVideoRequest', () => {
    socket.emit('videoLink', videoLinks[currentVideoIndex]);
  });

  // Listen for next video request from the client
  socket.on('nextVideoRequest', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoLinks.length;
    const nextVideoLink = videoLinks[currentVideoIndex];
    // Broadcast the new video link to all clients
    io.emit('videoLink', nextVideoLink);
  });
});

const PORT = process.env.PORT || 3005;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




