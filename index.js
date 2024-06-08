
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

const videoLinks = [
  "https://res.cloudinary.com/dpfcfb009/video/upload/v1717766249/IndividualQuestions/rrtjzajnpixain8gopmm.mp4",

  "https://res.cloudinary.com/dpfcfb009/video/upload/v1717766249/IndividualQuestions/ssg89dwgfz5mthpro41p.mp4",

  "https://res.cloudinary.com/dpfcfb009/video/upload/v1717766250/IndividualQuestions/cgmdquoj0gdbececwhue.mp4", 

  "https://res.cloudinary.com/dpfcfb009/video/upload/v1717766250/IndividualQuestions/irjp2ofvgd97pwfxnftg.mp4",

  "https://res.cloudinary.com/dpfcfb009/video/upload/v1717766249/IndividualQuestions/z7oojdt4qfg99yuwmpbr.mp4",
];

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Initialize video index for each client
  let currentVideoIndex = 0;

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
      socket.emit('videoLink', nextVideoLink);
    } else {
      console.log("No more videos to send"); // Debugging log
      socket.emit('videoLink', null);  // No more videos to send
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3006;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
