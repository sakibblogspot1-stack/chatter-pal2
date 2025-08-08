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

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && isConnected) {
          // Send audio chunk to server for processing
          sendMessage({
            type: 'audio_chunk',
            data: event.data,
            timestamp: Date.now()
          });
        }
      };
      
      mediaRecorder.start(1000); // Send chunks every second
      setIsRecording(true);
      
      // Start audio level monitoring
      const monitorAudio = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
        }
      };
      
      intervalRef.current = setInterval(monitorAudio, 100);
      
      // Start duration counter
      const startTime = Date.now();
      const updateDuration = () => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      };
      
      const durationInterval = setInterval(updateDuration, 1000);
      
      // Clean up duration interval when stopping
      const originalStop = mediaRecorder.stop.bind(mediaRecorder);
      mediaRecorder.stop = () => {
        clearInterval(durationInterval);
        originalStop();
      };
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
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