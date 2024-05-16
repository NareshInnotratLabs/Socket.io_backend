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

        'https://res.cloudinary.com/doy3ks7ls/video/upload/v1680075287/Intro_xb5ftf.mp4',
        'https://res.cloudinary.com/doy3ks7ls/video/upload/v1680075215/Question_1_rwml32.mp4',
        'https://res.cloudinary.com/doy3ks7ls/video/upload/v1680075219/Question_2_yeddjq.mp4',
        'https://res.cloudinary.com/doy3ks7ls/video/upload/v1680075219/Question_3_kqgbgw.mp4',
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




