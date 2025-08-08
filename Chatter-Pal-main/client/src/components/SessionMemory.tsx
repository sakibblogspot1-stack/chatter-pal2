import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SessionMemoryProps {
  progress?: {
    trackedIssues?: Record<string, number>;
    streakDays?: number;
    improvementAreas?: string[];
  };
  streakDays?: number;
}

export default function SessionMemory({ progress, streakDays = 0 }: SessionMemoryProps) {
  const trackedIssues = progress?.trackedIssues || {
    "Missing articles before nouns": 5,
    "Filler word usage": 12,
    "Pace variation": 3
  };
  
  const improvementAreas = progress?.improvementAreas || [
    "Try pausing instead of using filler words",
    "Consider using more varied vocabulary",
    "Focus on clearer articulation"
  ];

  const currentStreakDays = progress?.streakDays || streakDays || 7;

  const getIssueSeverity = (count: number) => {
    if (count > 10) return 'high';
    if (count > 5) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const getSeverityValueColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityDescColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className="rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Memory</h3>
      
      {/* Recent Issues */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Tracked Issues</h4>
        <div className="space-y-3">
          {Object.entries(trackedIssues).map(([issue, count]) => {
            const severity = getIssueSeverity(count);
            return (
              <div
                key={issue}
                className={`border rounded-lg p-3 ${getSeverityColor(severity)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${getSeverityTextColor(severity)}`}>
                    {issue}
                  </span>
                  <span className={`text-xs ${getSeverityValueColor(severity)}`}>
                    {count} times
                  </span>
                </div>
                <p className={`text-xs ${getSeverityDescColor(severity)}`}>
                  {issue.includes('article') ? 'Missing "the" before nouns' :
                   issue.includes('Filler') ? '"Um", "like", "you know"' :
                   'Better rhythm control'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Areas */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Focus Areas
        </h4>
        <div className="space-y-2">
          {improvementAreas.slice(0, 3).map((area, index) => (
            <div key={index} className="flex items-start text-sm text-gray-600">
              <AlertCircle className="w-3 h-3 text-blue-500 mr-2 mt-1 flex-shrink-0" />
              {area}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Streak */}
      <div className="bg-gradient-to-r from-[var(--primary-50)] to-[var(--secondary-50)] rounded-lg p-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-lg font-bold text-gray-800">
            {currentStreakDays} Day Streak
          </p>
          <p className="text-sm text-gray-600">Keep practicing daily!</p>
          
          {/* Streak visualization */}
          <div className="flex justify-center mt-3 space-x-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < currentStreakDays 
                    ? 'bg-orange-400' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Last session info */}
      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        Last session: 2 hours ago
      </div>
    </Card>
  );
}
