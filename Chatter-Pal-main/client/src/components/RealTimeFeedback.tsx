import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp, Clock, Volume2, Zap } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface FeedbackMessage {
  id: string;
  type: 'suggestion' | 'improvement' | 'encouragement';
  text: string;
  timestamp: Date;
}

export default function RealTimeFeedback() {
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    confidence: 0,
    clarity: 0,
    pace: 0,
    engagement: 0
  });
  
  const { lastMessage } = useWebSocket();

  // Handle incoming WebSocket feedback
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        if (data.type === 'feedback') {
          const newFeedback: FeedbackMessage = {
            id: Date.now().toString(),
            type: data.feedbackType || 'suggestion',
            text: data.text,
            timestamp: new Date()
          };
          
          setFeedbackMessages(prev => [newFeedback, ...prev.slice(0, 4)]); // Keep last 5
        }
        
        if (data.type === 'metrics') {
          setCurrentMetrics({
            confidence: data.confidence || 0,
            clarity: data.clarity || 0,
            pace: data.pace || 0,
            engagement: data.engagement || 0
          });
        }
      } catch (error) {
        console.error('Error parsing feedback message:', error);
      }
    }
  }, [lastMessage]);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="w-4 h-4" />;
      case 'encouragement': return <Zap className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'encouragement': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Real-Time Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Speaking Metrics</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Confidence</span>
              <span className={`text-sm font-medium ${getMetricColor(currentMetrics.confidence)}`}>
                {currentMetrics.confidence}%
              </span>
            </div>
            <Progress value={currentMetrics.confidence} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Clarity</span>
              <span className={`text-sm font-medium ${getMetricColor(currentMetrics.clarity)}`}>
                {currentMetrics.clarity}%
              </span>
            </div>
            <Progress value={currentMetrics.clarity} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Pace</span>
              <span className={`text-sm font-medium ${getMetricColor(currentMetrics.pace)}`}>
                {currentMetrics.pace}%
              </span>
            </div>
            <Progress value={currentMetrics.pace} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Engagement</span>
              <span className={`text-sm font-medium ${getMetricColor(currentMetrics.engagement)}`}>
                {currentMetrics.engagement}%
              </span>
            </div>
            <Progress value={currentMetrics.engagement} className="h-2" />
          </div>
        </div>

        {/* Live Feedback Messages */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Live Coaching</h4>
          
          {feedbackMessages.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {feedbackMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border ${getFeedbackColor(message.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    {getFeedbackIcon(message.type)}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start speaking to receive real-time feedback</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Slow Down
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              More Energy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}