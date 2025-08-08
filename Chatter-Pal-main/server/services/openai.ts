
async analyzePersonality(transcript: string, previousAnalysis?: PersonalityAnalysis): Promise<PersonalityAnalysis> {
    try {
      const systemPrompt = `You are ChatterPal, an advanced AI speaking coach specializing in foreign language fluency and confidence building.
      Analyze the speaking patterns to understand the learner's communication style and provide comprehensive feedback.
      
      Focus on ChatterPal's core features:
      - Pronunciation accuracy and improvement suggestions
      - Grammar error detection and corrections
      - Vocabulary enhancement and alternatives for overused words
      - Fluency scoring and confidence building
      - Cross-session memory of recurring mistakes
      - Contextual conversation analysis
      
      Respond with JSON in this exact format:
      {
        "primaryType": "string (e.g., 'Confident Speaker', 'Developing Communicator', 'Fluent Conversationalist')",
        "secondaryTrait": "string (complementary speaking trait)",
        "strengths": ["array of 4-5 specific positive observations"],
        "growthAreas": ["array of 4-5 actionable improvement suggestions"],
        "confidence": number (0-100),
        "pronunciationScore": number (0-100),
        "fluencyScore": number (0-100),
        "grammarScore": number (0-100),
        "vocabularyScore": number (0-100),
        "overusedWords": ["array of frequently repeated words"],
        "vocabularySuggestions": ["array of alternative word choices"],
        "grammarErrors": ["array of specific grammar mistakes found"],
        "pronunciationIssues": ["array of pronunciation corrections needed"],
        "contextualRelevance": number (0-100),
        "traits": {
          "confident": number (0-100),
          "expressive": number (0-100),
          "analytical": number (0-100),
          "social": number (0-100),
          "creative": number (0-100),
          "technical": number (0-100)
        },
        "sessionMemory": {
          "recurringMistakes": ["array of repeated errors across sessions"],
          "improvementAreas": ["array of areas showing progress"],
          "recommendedFocus": ["array of suggested practice areas"]
        }
      }`;

      const userPrompt = `Analyze this learner's speech for ChatterPal coaching:
      
      Transcript: "${transcript}"
      
      ${previousAnalysis ? `Previous session analysis for cross-session memory: ${JSON.stringify(previousAnalysis)}` : ''}
      
      Provide detailed analysis covering:
      1. Pronunciation accuracy and specific sounds to work on
      2. Grammar patterns and common errors
      3. Vocabulary usage and overused words with alternatives
      4. Overall fluency and confidence assessment
      5. Contextual appropriateness of language use
      6. Cross-session progress tracking`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("No response from OpenAI");
      }

      const analysis = JSON.parse(responseText);
      
      // Validate required fields
      const requiredFields = [
        'primaryType', 'secondaryTrait', 'strengths', 'growthAreas', 
        'confidence', 'pronunciationScore', 'fluencyScore', 'grammarScore',
        'vocabularyScore', 'traits', 'sessionMemory'
      ];
      
      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return analysis;
    } catch (error) {
      console.error("Error analyzing personality:", error);
      
      // Return default analysis for ChatterPal
      return {
        primaryType: "Developing Speaker",
        secondaryTrait: "Enthusiastic Learner",
        strengths: [
          "Shows willingness to practice and improve",
          "Demonstrates effort in communication",
          "Has potential for growth",
          "Maintains positive attitude toward learning"
        ],
        growthAreas: [
          "Focus on pronunciation clarity",
          "Practice grammar fundamentals",
          "Expand vocabulary usage",
          "Build speaking confidence",
          "Work on fluency rhythm"
        ],
        confidence: 65,
        pronunciationScore: 70,
        fluencyScore: 65,
        grammarScore: 68,
        vocabularyScore: 72,
        overusedWords: ["like", "actually", "basically"],
        vocabularySuggestions: ["indeed", "furthermore", "essentially"],
        grammarErrors: ["Subject-verb agreement", "Article usage"],
        pronunciationIssues: ["Word stress patterns", "Vowel sounds"],
        contextualRelevance: 75,
        traits: {
          confident: 65,
          expressive: 70,
          analytical: 60,
          social: 75,
          creative: 68,
          technical: 62
        },
        sessionMemory: {
          recurringMistakes: ["Pronunciation of 'th' sounds", "Past tense irregulars"],
          improvementAreas: ["Vocabulary expansion", "Speaking confidence"],
          recommendedFocus: ["Daily conversation practice", "Pronunciation drills"]
        }
      };
    }
  }

  async generateConversationContext(context: string, userLevel: string = "intermediate"): Promise<string> {
    try {
      const systemPrompt = `You are ChatterPal's conversation AI. Generate natural, engaging conversation starters and responses based on the given context and user's language level.
      
      Create conversations that:
      - Are appropriate for the specified context
      - Match the user's language proficiency level
      - Encourage natural speech patterns
      - Include opportunities for vocabulary growth
      - Are culturally appropriate and inclusive
      
      Keep responses conversational, supportive, and encouraging.`;

      const userPrompt = `Generate a conversation starter for context: "${context}" at ${userLevel} level.
      
      Make it engaging and natural, as if talking to a friend who is learning the language.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      return completion.choices[0]?.message?.content || "Hi there! What would you like to talk about today?";
    } catch (error) {
      console.error("Error generating conversation context:", error);
      return "Hello! I'm excited to practice speaking with you. What's on your mind today?";
    }
  }

  async generateInterviewQuestion(subject: string, difficulty: string, previousQuestions: string[] = []): Promise<string> {
    try {
      const systemPrompt = `You are ChatterPal's interview simulator. Generate appropriate interview questions based on the subject and difficulty level.
      
      Create questions that:
      - Match the specified subject area and difficulty
      - Are realistic for actual job interviews
      - Encourage detailed, thoughtful responses
      - Build progressively in complexity
      - Avoid repeating previous questions
      
      Adapt difficulty:
      - Beginner: Simple, direct questions
      - Intermediate: Multi-part questions with some complexity
      - Advanced: Complex scenarios and behavioral questions
      - Adaptive: Adjust based on response quality`;

      const userPrompt = `Generate an interview question for:
      Subject: ${subject}
      Difficulty: ${difficulty}
      Previous questions asked: ${previousQuestions.join(", ") || "None"}
      
      Make it realistic and appropriate for the level.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return completion.choices[0]?.message?.content || "Tell me about your experience with this field.";
    } catch (error) {
      console.error("Error generating interview question:", error);
      return "Can you describe a challenging situation you've faced and how you handled it?";
    }
  }

  async generateSeminarQuestion(presentationContent: string): Promise<string> {
    try {
      const systemPrompt = `You are ChatterPal's seminar AI that generates relevant audience questions based on presentation content.
      
      Create questions that:
      - Are directly related to the presentation content
      - Encourage deeper thinking and elaboration
      - Are appropriate for an academic or professional setting
      - Challenge the speaker to demonstrate expertise
      - Are realistic questions an audience might ask
      
      Focus on practical applications, clarifications, and extensions of the presented ideas.`;

      const userPrompt = `Based on this presentation content, generate a thoughtful audience question:
      
      "${presentationContent}"
      
      Make it relevant and challenging but appropriate for the context.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 100
      });

      return completion.choices[0]?.message?.content || "Can you elaborate on how this applies to real-world scenarios?";
    } catch (error) {
      console.error("Error generating seminar question:", error);
      return "What are the practical implications of what you've presented?";
    }
  }

  async analyzeSpeechPace(transcript: string, duration: number): Promise<{
    wordsPerMinute: number;
    paceRating: "Too Slow" | "Optimal" | "Too Fast";
    suggestion: string;
  }> {
    const wordCount = transcript.split(/\s+/).filter(word => word.length > 0).length;
    const wordsPerMinute = Math.round((wordCount / duration) * 60);

    let paceRating: "Too Slow" | "Optimal" | "Too Fast";
    let suggestion: string;

    if (wordsPerMinute < 140) {
      paceRating = "Too Slow";
      suggestion = "Try to speak a bit faster to maintain audience engagement. Practice with a metronome to build rhythm.";
    } else if (wordsPerMinute > 180) {
      paceRating = "Too Fast";
      suggestion = "Slow down slightly to ensure clarity. Take pauses between main points to let ideas sink in.";
    } else {
      paceRating = "Optimal";
      suggestion = "Great speaking pace! You're maintaining good rhythm and clarity.";
    }

    return {
      wordsPerMinute,
      paceRating,
      suggestion
    };
  }
}
