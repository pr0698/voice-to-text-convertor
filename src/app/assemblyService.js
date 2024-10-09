

export const startTranscription = (audioStream, setTranscript) => {
  const socket = new WebSocket('wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000');

  socket.onopen = () => {
    console.log('WebSocket connected');
    const mediaRecorder = new MediaRecorder(audioStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    mediaRecorder.start(250); // Send data every 250ms

    socket.onmessage = (event) => {
      const result = JSON.parse(event.data);
      const text = result.text;
      setTranscript((prev) => prev + text);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      mediaRecorder.stop();
    };
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};
