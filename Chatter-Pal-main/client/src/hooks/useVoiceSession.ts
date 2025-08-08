import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  sessionId?: string;
  duration: number;
  isActive: boolean;
  transcript?: string;
  metrics?: {
    wordsPerMinute?: number;
    clarityScore?: number;
    fillerWordCount?: number;
    confidenceLevel?: number;
  };
  feedback?: Array<{
    type: 'suggestion' | 'praise' | 'correction';
    category: string;
    message: string;
    timestamp: Date;
  }>;
}

export function useVoiceSession(userId: string) {
  const [sessionData, setSessionData] = useState<SessionData>({
    duration: 0,
    isActive: false,
  });
  const [isSessionActive, setIsSessionActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const { sendMessage, lastMessage, isConnected } = useWebSocket();

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const message = JSON.parse(lastMessage);
      
      switch (message.type) {
        case 'session_started':
          setSessionData(prev => ({
            ...prev,
            sessionId: message.data.sessionId,
            isActive: true,
          }));
          toast({
            title: "Session Started",
            description: "AI Coach is now listening and analyzing your speech.",
          });
          break;

        case 'metrics_update':
          setSessionData(prev => ({
            ...prev,
            metrics: message.data,
          }));
          break;

        case 'feedback':
          setSessionData(prev => ({
            ...prev,
            feedback: message.data.map((item: any) => ({
              ...item,
              timestamp: new Date(),
            })),
          }));
          break;

        case 'error':
          toast({
            title: "Session Error",
            description: message.data.message,
            variant: "destructive",
          });
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [lastMessage, toast]);

  // Timer effect
  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSessionActive]);

  const startSession = async () => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "WebSocket connection not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone permission and start recording
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Create media recorder for audio processing
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Handle audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && sessionData.sessionId) {
          // In a real implementation, you would send audio data to the server
          // For now, we'll simulate with a transcript
          const simulatedTranscript = "This is a simulated transcript of the user's speech.";
          
          sendMessage({
            type: 'audio_data',
            sessionId: sessionData.sessionId,
            data: {
              transcript: simulatedTranscript,
              audioBlob: event.data,
            }
          });
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Send data every second

      // Send session start message
      sendMessage({
        type: 'start_session',
        data: { userId }
      });

      setIsSessionActive(true);
      setSessionData(prev => ({
        ...prev,
        duration: 0,
        isActive: true,
        transcript: '',
        feedback: [],
      }));

    } catch (error) {
      console.error('Error starting voice session:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const endSession = () => {
    try {
      // Stop media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        
        // Stop all audio tracks
        mediaRecorderRef.current.stream.getTracks().forEach(track => {
          track.stop();
        });
      }

      // Send end session message with error handling
      if (sessionData.sessionId) {
        sendMessage({
          type: 'end_session',
          sessionId: sessionData.sessionId,
          data: {
            duration: sessionData.duration,
            endedAt: Date.now()
          }
        });
      }

      setIsSessionActive(false);
      setSessionData(prev => ({
        ...prev,
        isActive: false,
      }));

      toast({
        title: "Session Ended",
        description: `Session completed. Duration: ${Math.floor(sessionData.duration / 60)}:${(sessionData.duration % 60).toString().padStart(2, '0')}`,
      });

    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Session End Error",
        description: "Session ended but there was an error generating the report.",
        variant: "destructive",
      });
      
      // Force cleanup even if there's an error
      setIsSessionActive(false);
      setSessionData(prev => ({
        ...prev,
        isActive: false,
      }));
    }
  };

  return {
    sessionData,
    isSessionActive,
    startSession,
    endSession,
    isConnected,
  };
}
