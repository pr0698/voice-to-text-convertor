// page.js

"use client";  // This marks the component as a Client Component

import { useState } from 'react';
import { startTranscription } from './assemblyService';

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startTranscription(stream, setTranscript);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting transcription:', error);
    }
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Real-Time Voice-to-Text</h1>
      <button onClick={handleStart} disabled={isRecording}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isRecording}>
        Stop
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}
