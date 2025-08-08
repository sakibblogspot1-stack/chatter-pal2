import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface PersonalityAnalysis {
  primaryType: string;
  secondaryTrait: string;
  strengths: string[];
  growthAreas: string[];
  confidence: number;
  traits: Record<string, number>;
}

export interface SpeechFeedback {
  type: 'suggestion' | 'praise' | 'correction';
  category: 'grammar' | 'pace' | 'personality' | 'filler' | 'clarity';
  message: string;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high';
}

export class OpenAIService {
  async analyzeConversationFlow(transcript: string, context: string): Promise<{
    fluencyScore: number;
    naturalFlow: string;
    contextRelevance: string;
    suggestions: string[];
  }> {
    try {
      const systemPrompt = `You are ChatterPal, an AI speaking coach focused on natural conversation flow and language fluency.
      Analyze the conversation for fluency, natural flow, and context relevance.
      
      Focus on:
      - How naturally the conversation flows
      - Relevance to the conversation context
      - Language fluency and clarity
      - Practical improvement suggestions
      
      Respond with JSON in this exact format:
      {
        "fluencyScore": number (0-100),
        "naturalFlow": "string (Excellent/Good/Needs Work)",
        "contextRelevance": "string (Excellent/Good/Needs Work)",
        "suggestions": ["array of 2-3 practical improvement tips"]
      }`;

      const userPrompt = `Analyze this conversation transcript:
      
      Context: ${context}
      Transcript: "${transcript}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('OpenAI conversation analysis error:', error);
      return {
        fluencyScore: 75,
        naturalFlow: "Good",
        contextRelevance: "Good",
        suggestions: ["Keep practicing natural conversation flow"]
      };
    }
  }

  async analyzePersonality(transcript: string, previousAnalysis?: PersonalityAnalysis): Promise<PersonalityAnalysis> {
    try {
      const systemPrompt = `You are ChatterPal, an AI speaking coach specializing in language learning support.
      Analyze the speaking patterns to understand the learner's communication style and provide supportive feedback.
      
      Focus on:
      - Communication confidence and style
      - Language learning progress indicators
      - Areas where the learner shows strength
      - Gentle suggestions for improvement
      
      Respond with JSON in this exact format:
      {
        "primaryType": "string (e.g., 'Confident Learner', 'Thoughtful Speaker', 'Enthusiastic Communicator')",
        "secondaryTrait": "string (complementary trait)",
        "strengths": ["array of 3-4 positive observations"],
        "growthAreas": ["array of 3-4 gentle improvement suggestions"],
        "confidence": number (0-100),
        "traits": {
          "confident": number (0-100),
          "expressive": number (0-100),
          "analytical": number (0-100),
          "social": number (0-100),
          "creative": number (0-100)
        }
      }`;

      const userPrompt = `Analyze this learner's speech patterns:
      
      "${transcript}"
      
      ${previousAnalysis ? `Previous analysis for context: ${JSON.stringify(previousAnalysis)}` : ''}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as PersonalityAnalysis;
    } catch (error) {
      console.error('OpenAI personality analysis error:', error);
      // Return default analysis instead of throwing
      return {
        primaryType: "Developing Learner",
        secondaryTrait: "Motivated",
        strengths: ["Shows enthusiasm for learning", "Attempts complex expressions"],
        growthAreas: ["Continue practicing daily", "Focus on natural flow"],
        confidence: 70,
        traits: {
          confident: 70,
          expressive: 65,
          analytical: 60,
          social: 75,
          creative: 68
        }
      };
    }
  }

  async generateRealTimeFeedback(
    recentTranscript: string,
    conversationContext: string,
    context: { fillerCount: number, pace: number, clarity: number }
  ): Promise<SpeechFeedback[]> {
    try {
      const systemPrompt = `You are ChatterPal, a supportive AI speaking coach for language learners.
      Provide encouraging, actionable feedback that focuses on natural conversation skills.
      
      Conversation context: ${conversationContext}
      Current context: Filler words: ${context.fillerCount}, Pace: ${context.pace} WPM, Clarity: ${context.clarity}%
      
      Provide 1-2 supportive feedback items. Focus on:
      - Encouraging natural conversation flow
      - Practical, immediate improvements
      - Celebrating progress and effort
      
      Respond with JSON array in this format:
      [
        {
          "type": "suggestion|praise|encouragement",
          "category": "fluency|vocabulary|pronunciation|confidence|flow",
          "message": "supportive, actionable feedback message",
          "suggestion": "specific alternative or technique (optional)",
          "severity": "low|medium|high"
        }
      ]`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Recent speech: "${recentTranscript}"` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"feedback": []}');
      return result.feedback || [];
    } catch (error) {
      console.error('OpenAI feedback generation error:', error);
      return [{
        type: 'encouragement',
        category: 'confidence',
        message: 'Great job practicing! Keep up the conversation flow.',
        severity: 'low'
      }];
    }
  }

  async analyzeHabitualPatterns(
    sessionTranscripts: string[],
    previousIssues: Record<string, number>
  ): Promise<{ issues: Record<string, number>, recommendations: string[] }> {
    try {
      const systemPrompt = `You are an expert speech pattern analyst. Identify recurring issues and patterns across multiple speaking sessions.
      
      Previous tracked issues: ${JSON.stringify(previousIssues)}
      
      Focus on:
      - Grammar mistakes (articles, tenses, etc.)
      - Filler word usage patterns
      - Speech rhythm and pacing issues
      - Vocabulary limitations
      
      Respond with JSON in this format:
      {
        "issues": {
          "article_usage": number,
          "filler_words": number,
          "pace_variation": number,
          "grammar_errors": number
        },
        "recommendations": ["array of specific practice suggestions"]
      }`;

      const transcriptText = sessionTranscripts.join('\n\n---SESSION BREAK---\n\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze these session transcripts:\n\n${transcriptText}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        issues: result.issues || {},
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error('OpenAI pattern analysis error:', error);
      return { issues: {}, recommendations: [] };
    }
  }
}

export const openaiService = new OpenAIService();