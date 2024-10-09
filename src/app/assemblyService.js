// assemblyService.js
import axios from 'axios';

const ASSEMBLYAI_API_KEY = '989595fca7fa489f80a9477a42da7db4'; // Replace with your valid AssemblyAI API key

export const startTranscription = async (audioStream, setTranscript) => {
  try {
    // Create WebSocket connection for real-time transcription
    const socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&access_token=${ASSEMBLYAI_API_KEY}`);

    const mediaRecorder = new MediaRecorder(audioStream);

    socket.onopen = () => {
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      });

      mediaRecorder.start(250); // Send audio chunks every 250ms
    };

    // Handle incoming transcription results
    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.text) {
        setTranscript((prev) => prev + ' ' + response.text);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      mediaRecorder.stop();
    };

    return socket;
  } catch (error) {
    console.error('Error with AssemblyAI real-time transcription:', error);
  }
};
