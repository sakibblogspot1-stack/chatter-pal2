import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, User, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalityAnalysisProps {
  user?: {
    personalityType?: string;
  };
  sessionData?: {
    personalityInsights?: {
      primaryType?: string;
      secondaryTrait?: string;
      strengths?: string[];
      growthAreas?: string[];
      traits?: Record<string, number>;
    };
  };
  className?: string;
}

export default function PersonalityAnalysis({ 
  user, 
  sessionData, 
  className 
}: PersonalityAnalysisProps) {
  const insights = sessionData?.personalityInsights;
  const primaryType = insights?.primaryType || user?.personalityType || "Diplomatic";
  const secondaryTrait = insights?.secondaryTrait || "Analytical";
  
  // Default strengths and growth areas
  const strengths = insights?.strengths || [
    "Uses inclusive language effectively",
    "Shows empathy in responses", 
    "Maintains respectful tone"
  ];
  
  const growthAreas = insights?.growthAreas || [
    "Be more direct in decisions",
    "Reduce hedging language",
    "Increase assertiveness"
  ];

  const traits = insights?.traits || {
    diplomatic: 85,
    analytical: 72,
    assertive: 45,
    empathetic: 90,
    direct: 35
  };

  return (
    <Card className={cn("rounded-xl shadow-lg border border-gray-200 p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[var(--accent-50)] to-[var(--primary-50)] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Primary Type</span>
            <Badge 
              variant="secondary" 
              className="bg-[color:var(--accent-100)] text-[color:var(--accent-700)]"
            >
              Detected
            </Badge>
          </div>
          <p className="text-xl font-bold text-[color:var(--accent-700)]">{primaryType}</p>
          <p className="text-sm text-gray-600 mt-1">Prefers consensus-building language</p>
        </div>

        <div className="bg-gradient-to-br from-[var(--secondary-50)] to-[var(--primary-50)] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Secondary Trait</span>
            <Badge 
              variant="secondary" 
              className="bg-[color:var(--secondary-100)] text-[color:var(--secondary-700)]"
            >
              Emerging
            </Badge>
          </div>
          <p className="text-xl font-bold text-[color:var(--secondary-700)]">{secondaryTrait}</p>
          <p className="text-sm text-gray-600 mt-1">Shows logical structure in speech</p>
        </div>
      </div>

      {/* Personality Traits Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          Trait Analysis
        </h4>
        <div className="space-y-2">
          {Object.entries(traits).map(([trait, value]) => (
            <div key={trait} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{trait}</span>
              <div className="flex items-center space-x-2 w-20">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[color:var(--primary-500)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personality Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-orange-700 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Growth Areas
          </h4>
          <ul className="space-y-2">
            {growthAreas.map((area, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <Target className="w-3 h-3 text-orange-500 mr-2 mt-1 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Coaching Suggestion */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
          <User className="w-4 h-4 mr-2" />
          Personalized Coaching Tip
        </h4>
        <p className="text-sm text-blue-700">
          As a {primaryType.toLowerCase()} speaker, try using more decisive language. 
          Instead of "Maybe we should consider...", try "I recommend we..." to show confidence 
          while maintaining your natural diplomatic style.
        </p>
      </div>
    </Card>
  );
}
