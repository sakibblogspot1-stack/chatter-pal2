import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, Play, Pause } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface VoiceInterfaceProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function VoiceInterface({ isActive, onToggle }: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { sendMessage, isConnected } = useWebSocket();

  // Start recording with performance optimizations
  const startRecording = async () => {
    try {
      console.time('audio-processing');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      streamRef.current = stream;

      // Set up audio context for level monitoring with performance optimization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128; // Reduced from 256 for better performance
      analyserRef.current.smoothingTimeConstant = 0.8;

      source.connect(analyserRef.current);

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.time('audio-chunk-processing');

          // Send audio data via WebSocket with throttling
          const reader = new FileReader();
          reader.onload = () => {
            sendMessage({
              type: 'audio_chunk',
              data: reader.result,
              timestamp: Date.now()
            });
            console.timeEnd('audio-chunk-processing');
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      mediaRecorder.start(2000); // Increased to 2-second chunks for better performance
      setIsRecording(true);

      // Optimized audio level monitoring with throttling
      let lastUpdateTime = 0;
      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          const now = performance.now();

          // Throttle updates to 30fps for better performance
          if (now - lastUpdateTime >= 33) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            setAudioLevel(Math.round((average / 255) * 100));
            lastUpdateTime = now;
          }

          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      console.timeEnd('audio-processing');

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setAudioLevel(0);
    setDuration(0);
  };

  // Handle WebSocket messages
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);

        if (data.type === 'transcript') {
          setTranscript(data.text);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  // Toggle recording
  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    onToggle();
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Mic className="w-5 h-5 mr-2" />
            Voice Interface
          </span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={handleToggle}
            size="lg"
            className={`w-20 h-20 rounded-full ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isRecording ? (
              <Square className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">Recording</p>
              <p className="text-lg font-mono">{formatDuration(duration)}</p>
            </div>

            {/* Audio Level Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Audio Level</span>
                <span>{Math.round(audioLevel)}%</span>
              </div>
              <Progress 
                value={audioLevel} 
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Live Transcript */}
        {transcript && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <h4 className="text-sm font-medium mb-2">Live Transcript</h4>
            <p className="text-sm text-gray-700">{transcript}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500">
          {isRecording 
            ? "Speak naturally. Your voice is being analyzed in real-time."
            : "Click the microphone to start your voice coaching session."
          }
        </div>
      </CardContent>
    </Card>
  );
}