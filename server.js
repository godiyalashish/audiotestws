const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Function to encode an audio file as base64
function getAudioAsBase64(filePath) {
  const audioBuffer = fs.readFileSync(filePath);
  return audioBuffer.toString('base64');
}

// Broadcast base64 audio to all connected clients every 5 seconds
function broadcastAudio() {
  const audioPath = path.join(__dirname, 'sample-audio.mp3'); // Example audio file
  const base64Audio = getAudioAsBase64(audioPath);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(base64Audio);
    }
  });
}

// WebSocket connection setup
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send audio every 5 seconds
  const interval = setInterval(broadcastAudio, 7000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
