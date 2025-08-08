export interface SpeechMetrics {
  wordsPerMinute: number;
  clarityScore: number;
  fillerWordCount: number;
  confidenceLevel: number;
  pauseAnalysis: {
    averagePauseLength: number;
    pauseFrequency: number;
  };
  volumeAnalysis: {
    averageVolume: number;
    volumeVariation: number;
  };
}

export interface TranscriptAnalysis {
  transcript: string;
  words: string[];
  sentences: string[];
  fillerWords: string[];
  confidence: number;
}

export class SpeechAnalyzer {
  private fillerWords = [
    'um', 'uh', 'like', 'you know', 'so', 'well', 'actually', 'basically',
    'literally', 'totally', 'really', 'very', 'quite', 'just', 'maybe',
    'i mean', 'sort of', 'kind of'
  ];

  analyzeTranscript(transcript: string, duration: number): SpeechMetrics {
    const words = this.extractWords(transcript);
    const fillerWords = this.countFillerWords(words);
    
    // Calculate words per minute
    const wordsPerMinute = Math.round((words.length / duration) * 60);
    
    // Calculate clarity score based on various factors
    const clarityScore = this.calculateClarityScore(transcript, words, fillerWords.length);
    
    // Estimate confidence level based on language patterns
    const confidenceLevel = this.estimateConfidence(transcript, words);
    
    return {
      wordsPerMinute,
      clarityScore,
      fillerWordCount: fillerWords.length,
      confidenceLevel,
      pauseAnalysis: {
        averagePauseLength: 0.8, // Would be calculated from audio analysis
        pauseFrequency: 0.3
      },
      volumeAnalysis: {
        averageVolume: 0.7, // Would be calculated from audio analysis
        volumeVariation: 0.4
      }
    };
  }

  private extractWords(transcript: string): string[] {
    return transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  private countFillerWords(words: string[]): string[] {
    const found: string[] = [];
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const twoWordPhrase = i < words.length - 1 ? `${word} ${words[i + 1]}` : '';
      const threeWordPhrase = i < words.length - 2 ? `${word} ${words[i + 1]} ${words[i + 2]}` : '';
      
      // Check for multi-word filler phrases first
      if (this.fillerWords.includes(threeWordPhrase)) {
        found.push(threeWordPhrase);
        i += 2; // Skip next two words
      } else if (this.fillerWords.includes(twoWordPhrase)) {
        found.push(twoWordPhrase);
        i += 1; // Skip next word
      } else if (this.fillerWords.includes(word)) {
        found.push(word);
      }
    }
    
    return found;
  }

  private calculateClarityScore(transcript: string, words: string[], fillerCount: number): number {
    let score = 100;
    
    // Penalize for filler words
    const fillerRatio = fillerCount / words.length;
    score -= fillerRatio * 30;
    
    // Penalize for repetitive words
    const uniqueWords = new Set(words).size;
    const varietyRatio = uniqueWords / words.length;
    if (varietyRatio < 0.5) {
      score -= (0.5 - varietyRatio) * 20;
    }
    
    // Penalize for incomplete sentences
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = words.length / sentences.length;
    if (avgSentenceLength < 5) {
      score -= 10;
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private estimateConfidence(transcript: string, words: string[]): number {
    let confidenceScore = 70; // Base confidence
    
    // Confident indicators
    const confidentPhrases = [
      'i believe', 'i think', 'clearly', 'obviously', 'definitely',
      'certainly', 'absolutely', 'without doubt', 'i\'m confident'
    ];
    
    // Uncertain indicators
    const uncertainPhrases = [
      'maybe', 'perhaps', 'i guess', 'probably', 'might be',
      'could be', 'not sure', 'i don\'t know', 'possibly'
    ];
    
    const text = transcript.toLowerCase();
    
    // Boost for confident language
    confidentPhrases.forEach(phrase => {
      const matches = (text.match(new RegExp(phrase, 'g')) || []).length;
      confidenceScore += matches * 5;
    });
    
    // Reduce for uncertain language
    uncertainPhrases.forEach(phrase => {
      const matches = (text.match(new RegExp(phrase, 'g')) || []).length;
      confidenceScore -= matches * 8;
    });
    
    // Adjust for question frequency (too many questions indicate uncertainty)
    const questionCount = (transcript.match(/\?/g) || []).length;
    if (questionCount > words.length * 0.1) {
      confidenceScore -= 15;
    }
    
    return Math.max(0, Math.min(100, Math.round(confidenceScore)));
  }

  detectSpeechPatterns(transcript: string): {
    grammarIssues: string[];
    styleObservations: string[];
    improvementSuggestions: string[];
  } {
    const grammarIssues = this.detectGrammarIssues(transcript);
    const styleObservations = this.analyzeStyle(transcript);
    const improvementSuggestions = this.generateSuggestions(transcript);
    
    return {
      grammarIssues,
      styleObservations,
      improvementSuggestions
    };
  }

  private detectGrammarIssues(transcript: string): string[] {
    const issues: string[] = [];
    const text = transcript.toLowerCase();
    
    // Check for missing articles
    const articlePattern = /\b(a|an|the)\s+\w+/g;
    const nounPattern = /\b(person|people|thing|idea|concept|problem|solution)\b/g;
    const articles = (text.match(articlePattern) || []).length;
    const nouns = (text.match(nounPattern) || []).length;
    
    if (nouns > 0 && articles / nouns < 0.3) {
      issues.push('Missing articles before nouns');
    }
    
    // Check for subject-verb agreement
    const svErrors = [
      'he are', 'she are', 'it are', 'they is', 'we is', 'you is'
    ];
    
    svErrors.forEach(error => {
      if (text.includes(error)) {
        issues.push('Subject-verb agreement error');
      }
    });
    
    return issues;
  }

  private analyzeStyle(transcript: string): string[] {
    const observations: string[] = [];
    const text = transcript.toLowerCase();
    
    // Check for diplomatic language
    const diplomaticPhrases = [
      'i respectfully', 'perhaps we could', 'it might be worth',
      'from my perspective', 'i would suggest', 'if i may'
    ];
    
    const diplomaticCount = diplomaticPhrases.reduce((count, phrase) => {
      return count + (text.match(new RegExp(phrase, 'g')) || []).length;
    }, 0);
    
    if (diplomaticCount > 0) {
      observations.push('Uses diplomatic language patterns');
    }
    
    // Check for assertive language
    const assertivePhrases = [
      'i will', 'we must', 'it is essential', 'clearly',
      'without question', 'i insist', 'we need to'
    ];
    
    const assertiveCount = assertivePhrases.reduce((count, phrase) => {
      return count + (text.match(new RegExp(phrase, 'g')) || []).length;
    }, 0);
    
    if (assertiveCount > 0) {
      observations.push('Shows assertive communication style');
    }
    
    return observations;
  }

  private generateSuggestions(transcript: string): string[] {
    const suggestions: string[] = [];
    const words = this.extractWords(transcript);
    const fillerCount = this.countFillerWords(words).length;
    
    if (fillerCount > words.length * 0.05) {
      suggestions.push('Try pausing instead of using filler words');
    }
    
    if (words.length < 50) {
      suggestions.push('Try expanding your responses with more detail');
    }
    
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    if (avgWordLength < 4) {
      suggestions.push('Consider using more varied vocabulary');
    }
    
    return suggestions;
  }
}

export const speechAnalyzer = new SpeechAnalyzer();
