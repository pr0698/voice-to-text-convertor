"use client";

import { useState, useEffect } from 'react';
import { Button, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { startTranscription } from './assemblyService'; // Adjust the path if needed

export default function VoiceToText() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeMode, setThemeMode] = useState('light');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Set initial theme based on system preference
  useEffect(() => {
    setThemeMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: { main: '#1e88e5' },
      secondary: { main: '#f50057' },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#ffffff', // Darker background for dark mode
        paper: themeMode === 'dark' ? '#1c1c1c' : '#ffffff',   // Slightly lighter paper color for cards
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000', // Lighter text for dark mode
      },
    },
  });

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startTranscription(stream, setTranscript);
      setIsRecording(true);
      setLoading(false);
    } catch (error) {
      console.error('Error starting transcription:', error);
      setLoading(false);
    }
  };

  const handleStop = () => {
    setIsRecording(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: theme.palette.background.default,
          transition: 'background-color 0.3s',
        }}
      >
        {/* Theme toggle button */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>

        <Typography variant="h4" gutterBottom color={theme.palette.text.primary}>
          Real-Time Voice-to-Text
        </Typography>

        <Box my={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStart}
            disabled={isRecording || loading}
            sx={{ mx: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Start'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStop}
            disabled={!isRecording}
            sx={{ mx: 1 }}
          >
            Stop
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
          Transcript:
        </Typography>
        <Box
          sx={{
            width: '80%',
            maxHeight: '200px',
            overflowY: 'auto',
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 1,
            fontFamily: 'monospace',
            fontSize: '1.2rem',
            border: `1px solid ${themeMode === 'light' ? '#ccc' : '#555'}`,
            transition: 'all 0.3s',
            color: theme.palette.text.primary, // Set text color
          }}
        >
          {transcript || 'Speak to see the transcript here...'}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
