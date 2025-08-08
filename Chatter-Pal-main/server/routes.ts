import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import { speechAnalyzer } from "./services/speechAnalyzer";
import { wsMessageSchema, type WSMessage } from "@shared/schema";

interface SessionData {
  userId: string;
  sessionId: string;
  startTime: Date;
  transcript: string;
  audioChunks: Buffer[];
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time voice communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active sessions
  const activeSessions = new Map<string, SessionData>();
  
  // API Routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/user/:id/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.id);
      if (!progress) {
        // Create initial progress record if it doesn't exist
        const newProgress = await storage.createUserProgress({
          userId: req.params.id,
          totalSpeakingTime: 0,
          streakDays: 0,
          trackedIssues: {},
          personalityTraits: {},
          improvementAreas: {},
          lastSessionAt: null,
        });
        return res.json(newProgress);
      }
      res.json(progress);
    } catch (error) {
      console.error('User progress error:', error);
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  app.get("/api/user/:id/sessions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await storage.getUserSessions(req.params.id, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user sessions" });
    }
  });

  app.get("/api/session/:id/feedback", async (req, res) => {
    try {
      const feedback = await storage.getSessionFeedback(req.params.id);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session feedback" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        const validatedMessage = wsMessageSchema.parse(message);
        
        await handleWebSocketMessage(ws, validatedMessage, activeSessions);
      } catch (error) {
        console.error('WebSocket message error:', error);
        sendWebSocketMessage(ws, {
          type: 'error',
          data: { message: 'Invalid message format' }
        });
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      // Clean up any active sessions for this connection
      for (const [sessionId, sessionData] of Array.from(activeSessions.entries())) {
        if (sessionData) {
          handleSessionEnd(sessionId, sessionData, activeSessions);
        }
      }
    });
  });

  return httpServer;
}

async function handleWebSocketMessage(
  ws: WebSocket, 
  message: WSMessage, 
  activeSessions: Map<string, SessionData>
) {
  switch (message.type) {
    case 'start_session':
      await handleSessionStart(ws, message, activeSessions);
      break;
      
    case 'audio_data':
      await handleAudioData(ws, message, activeSessions);
      break;
      
    case 'end_session':
      await handleSessionEnd(message.sessionId!, activeSessions.get(message.sessionId!), activeSessions);
      break;
      
    default:
      sendWebSocketMessage(ws, {
        type: 'error',
        data: { message: 'Unknown message type' }
      });
  }
}

async function handleSessionStart(
  ws: WebSocket, 
  message: WSMessage, 
  activeSessions: Map<string, SessionData>
) {
  try {
    const { userId } = message.data;
    
    // Check if user has an active session
    const existingSession = await storage.getActiveSession(userId);
    if (existingSession) {
      await storage.updateVoiceSession(existingSession.id, { isActive: false });
    }
    
    // Create new session
    const session = await storage.createVoiceSession({
      userId,
      duration: 0,
      fillerWordCount: 0,
      isActive: true,
    });
    
    // Store session data
    activeSessions.set(session.id, {
      userId,
      sessionId: session.id,
      startTime: new Date(),
      transcript: '',
      audioChunks: []
    });
    
    sendWebSocketMessage(ws, {
      type: 'session_started',
      data: { sessionId: session.id },
      sessionId: session.id
    });
    
  } catch (error) {
    console.error('Session start error:', error);
    sendWebSocketMessage(ws, {
      type: 'error',
      data: { message: 'Failed to start session' }
    });
  }
}

async function handleAudioData(
  ws: WebSocket, 
  message: WSMessage, 
  activeSessions: Map<string, SessionData>
) {
  const { sessionId } = message;
  if (!sessionId) return;
  
  const sessionData = activeSessions.get(sessionId);
  if (!sessionData) {
    sendWebSocketMessage(ws, {
      type: 'error',
      data: { message: 'Session not found' }
    });
    return;
  }
  
  try {
    // In a real implementation, this would process audio data
    // For now, we'll simulate transcript generation
    const { transcript } = message.data;
    
    if (transcript) {
      sessionData.transcript += ' ' + transcript;
      
      // Analyze the current transcript
      const duration = (Date.now() - sessionData.startTime.getTime()) / 1000;
      const metrics = speechAnalyzer.analyzeTranscript(sessionData.transcript, duration);
      
      // Generate real-time feedback
      const user = await storage.getUser(sessionData.userId);
      const personalityType = user?.personalityType || 'Unknown';
      
      const feedback = await openaiService.generateRealTimeFeedback(
        transcript,
        personalityType,
        {
          fillerCount: metrics.fillerWordCount,
          pace: metrics.wordsPerMinute,
          clarity: metrics.clarityScore
        }
      );
      
      // Save feedback to database
      for (const feedbackItem of feedback) {
        await storage.createSessionFeedback({
          sessionId,
          type: feedbackItem.type,
          category: feedbackItem.category,
          message: feedbackItem.message,
        });
      }
      
      // Send real-time updates
      sendWebSocketMessage(ws, {
        type: 'metrics_update',
        data: metrics,
        sessionId
      });
      
      sendWebSocketMessage(ws, {
        type: 'feedback',
        data: feedback,
        sessionId
      });
    }
    
  } catch (error) {
    console.error('Audio processing error:', error);
    sendWebSocketMessage(ws, {
      type: 'error',
      data: { message: 'Failed to process audio' }
    });
  }
}

async function handleSessionEnd(
  sessionId: string, 
  sessionData: SessionData | undefined, 
  activeSessions: Map<string, SessionData>
) {
  if (!sessionData) return;
  
  try {
    const duration = Math.floor((Date.now() - sessionData.startTime.getTime()) / 1000);
    
    // Analyze final transcript
    const metrics = speechAnalyzer.analyzeTranscript(sessionData.transcript, duration);
    const patterns = speechAnalyzer.detectSpeechPatterns(sessionData.transcript);
    
    // Generate personality analysis
    const user = await storage.getUser(sessionData.userId);
    const personalityAnalysis = await openaiService.analyzePersonality(
      sessionData.transcript,
      user?.personalityType ? { primaryType: user.personalityType } as any : undefined
    );
    
    // Update session with final data
    await storage.updateVoiceSession(sessionId, {
      duration,
      wordsPerMinute: metrics.wordsPerMinute,
      clarityScore: metrics.clarityScore,
      fillerWordCount: metrics.fillerWordCount,
      confidenceLevel: metrics.confidenceLevel,
      transcript: sessionData.transcript,
      personalityInsights: personalityAnalysis,
      isActive: false,
    });
    
    // Update user personality type if needed
    if (personalityAnalysis.primaryType !== user?.personalityType) {
      await storage.updateUser(sessionData.userId, {
        personalityType: personalityAnalysis.primaryType,
      });
    }
    
    // Update user progress
    const progress = await storage.getUserProgress(sessionData.userId);
    if (progress) {
      const currentIssues = progress.trackedIssues as Record<string, number> || {};
      patterns.grammarIssues.forEach(issue => {
        currentIssues[issue] = (currentIssues[issue] || 0) + 1;
      });
      
      await storage.updateUserProgress(sessionData.userId, {
        totalSpeakingTime: (progress.totalSpeakingTime || 0) + duration,
        trackedIssues: currentIssues,
        personalityTraits: personalityAnalysis.traits,
        improvementAreas: patterns.improvementSuggestions,
        lastSessionAt: new Date(),
      });
    }
    
    // Clean up session data
    activeSessions.delete(sessionId);
    
  } catch (error) {
    console.error('Session end error:', error);
  }
}

function sendWebSocketMessage(ws: WebSocket, message: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
