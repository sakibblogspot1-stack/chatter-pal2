import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge, Volume2, Filter, TrendingUp } from "lucide-react";

interface SpeakingMetricsProps {
  sessionData?: {
    metrics?: {
      wordsPerMinute?: number;
      clarityScore?: number;
      fillerWordCount?: number;
      confidenceLevel?: number;
    };
  };
}

export default function SpeakingMetrics({ sessionData }: SpeakingMetricsProps) {
  const metrics = sessionData?.metrics || {};
  
  // Default values when no session data
  const wordsPerMinute = metrics.wordsPerMinute || 145;
  const clarityScore = metrics.clarityScore || 87;
  const fillerWordCount = metrics.fillerWordCount || 7;
  const confidenceLevel = metrics.confidenceLevel || 73;

  const MetricItem = ({ 
    icon: Icon, 
    label, 
    value, 
    color = "primary",
    showProgress = false,
    suffix = ""
  }: {
    icon: any;
    label: string;
    value: number;
    color?: "primary" | "secondary" | "warning" | "accent";
    showProgress?: boolean;
    suffix?: string;
  }) => {
    const getColorClasses = (color: string) => {
      switch (color) {
        case 'primary':
          return { icon: 'text-[color:var(--primary-500)]', progress: 'bg-[color:var(--primary-500)]', text: 'text-[color:var(--primary-600)]' };
        case 'secondary':
          return { icon: 'text-[color:var(--secondary-500)]', progress: 'bg-[color:var(--secondary-500)]', text: 'text-[color:var(--secondary-600)]' };
        case 'warning':
          return { icon: 'text-yellow-500', progress: 'bg-yellow-500', text: 'text-yellow-600' };
        case 'accent':
          return { icon: 'text-[color:var(--accent-500)]', progress: 'bg-[color:var(--accent-500)]', text: 'text-[color:var(--accent-600)]' };
        default:
          return { icon: 'text-gray-500', progress: 'bg-gray-500', text: 'text-gray-600' };
      }
    };

    const colors = getColorClasses(color);

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <Icon className={`w-4 h-4 mr-3 ${colors.icon}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        {showProgress ? (
          <div className="flex items-center space-x-2">
            <Progress value={value} className="w-16 h-2" />
            <span className={`text-sm font-bold ${colors.text}`}>{value}%</span>
          </div>
        ) : (
          <span className={`text-lg font-bold ${colors.text}`}>
            {value}{suffix}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Speaking Metrics</h3>
      
      <div className="space-y-4">
        <MetricItem
          icon={Gauge}
          label="Words per Minute"
          value={wordsPerMinute}
          color="primary"
        />

        <MetricItem
          icon={Volume2}
          label="Clarity Score"
          value={clarityScore}
          color="secondary"
          showProgress={true}
        />

        <MetricItem
          icon={Filter}
          label="Filler Words"
          value={fillerWordCount}
          color="warning"
        />

        <MetricItem
          icon={TrendingUp}
          label="Confidence Level"
          value={confidenceLevel}
          color="accent"
          showProgress={true}
        />
      </div>

      {/* Additional insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Quick Insight</h4>
        <p className="text-sm text-blue-700">
          {wordsPerMinute > 150 ? "You're speaking at a good pace. " : 
           wordsPerMinute < 120 ? "Consider speaking a bit faster for better engagement. " : 
           "Your speaking pace is well-balanced. "}
          {clarityScore > 80 ? "Your clarity is excellent!" : 
           "Focus on clearer articulation for better understanding."}
        </p>
      </div>
    </Card>
  );
}
