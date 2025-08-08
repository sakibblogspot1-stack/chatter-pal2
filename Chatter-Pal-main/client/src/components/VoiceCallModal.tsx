import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOff, MicOff, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface VoiceCallModalProps {
  isOpen: boolean;
  sessionData?: {
    duration?: number;
  };
  onEndSession: () => void;
}

export default function VoiceCallModal({
  isOpen,
  sessionData,
  onEndSession,
}: VoiceCallModalProps) {
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionTime = sessionData?.duration || 0;

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual mute functionality
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <div className="p-4 text-center">
          <div className="mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full gradient-primary rounded-full flex items-center justify-center relative">
                <Mic className="w-10 h-10 text-white" />
                <div className="absolute inset-0 rounded-full border-4 border-[color:var(--primary-300)] animate-pulse-slow" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Voice Session Active
            </h3>
            <p className="text-gray-600">AI Coach is listening and analyzing...</p>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-mono font-bold text-[color:var(--primary-600)]">
              {formatTime(sessionTime)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Session Duration</p>
          </div>

          <div className="flex space-x-4 justify-center">
            <Button
              variant="destructive"
              size="lg"
              className="px-6 py-3 rounded-full"
              onClick={onEndSession}
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Session
            </Button>
            <Button
              variant={isMuted ? "default" : "secondary"}
              size="lg"
              className={cn(
                "px-6 py-3 rounded-full",
                isMuted && "bg-red-500 hover:bg-red-600 text-white"
              )}
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4 mr-2" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          </div>

          {isMuted && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Microphone is muted. AI analysis is paused.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
