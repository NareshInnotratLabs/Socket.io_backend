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

  socket.on('initialVideoRequest', () => {
    if (currentVideoIndex < videoLinks.length) {
      console.log("Sending initial video:", videoLinks[currentVideoIndex]); // Debugging log
      socket.emit('videoLink', videoLinks[currentVideoIndex]);
    } else {
      console.log("No more videos to play");
      socket.emit('videoLink', null);  // No more videos to send
    }
  });

  socket.on('nextVideoRequest', () => {
    currentVideoIndex++;
    if (currentVideoIndex < videoLinks.length) {
      const nextVideoLink = videoLinks[currentVideoIndex];
      console.log("Sending next video:", nextVideoLink); // Debugging log
      io.emit('videoLink', nextVideoLink);
    } else {
      console.log("No more videos to send"); // Debugging log
      io.emit('videoLink', null);  // No more videos to send
    }
  });
});

const PORT = process.env.PORT || 3005;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




