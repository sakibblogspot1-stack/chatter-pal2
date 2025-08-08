import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Basic API routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/user/:id", (_req, res) => {
    res.json({ 
      id: "ac3507e4-9e2d-4e58-b0f7-2410465f5775",
      name: "Demo User",
      personalityType: "analytical"
    });
  });

  app.get("/api/user/:id/progress", (_req, res) => {
    res.json({
      sessionsCompleted: 0,
      avgConfidence: 0,
      avgClarity: 0,
      streak: 0
    });
  });

  // WebSocket setup - use a specific path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ 
    server,
    path: "/ws"
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket connection established");
    let sessionId: string | null = null;
    let sessionData: any = {};

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Received message:", message.type);

        switch (message.type) {
          case 'start_session':
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionData = {
              userId: message.data.userId,
              startTime: Date.now(),
              audioChunks: []
            };
            
            ws.send(JSON.stringify({
              type: "session_started",
              data: { sessionId }
            }));
            break;

          case 'audio_chunk':
            if (sessionId && message.data) {
              // Simulate real-time analysis
              const analysis = analyzeAudioChunk(message.data);
              
              // Send live feedback
              ws.send(JSON.stringify({
                type: "live_feedback",
                data: analysis
              }));

              // Update metrics every few chunks
              if (sessionData.audioChunks.length % 3 === 0) {
                ws.send(JSON.stringify({
                  type: "metrics_update",
                  data: {
                    wordsPerMinute: Math.floor(Math.random() * 30) + 120,
                    clarityScore: Math.floor(Math.random() * 20) + 75,
                    fillerWordCount: Math.floor(Math.random() * 5),
                    confidenceLevel: Math.floor(Math.random() * 15) + 80
                  }
                }));
              }
              
              sessionData.audioChunks.push({
                timestamp: message.timestamp || Date.now(),
                size: message.data.length || 0
              });
            }
            break;

          case 'end_session':
            if (sessionId) {
              try {
                const report = generateSessionReport(sessionData);
                ws.send(JSON.stringify({
                  type: "session_report",
                  data: report
                }));
                
                console.log(`Session ${sessionId} ended successfully`);
                sessionId = null;
                sessionData = {};
              } catch (error) {
                console.error('REPORT GEN FAILED:', error);
                ws.send(JSON.stringify({
                  type: "error",
                  data: { message: "Failed to generate report" }
                }));
              }
            }
            break;

          default:
            ws.send(JSON.stringify({
              type: "feedback",
              data: { message: "Message received" }
            }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({
          type: "error",
          data: { message: "Failed to process message" }
        }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      if (sessionId) {
        console.log(`Cleaning up session: ${sessionId}`);
      }
    });
  });

  // Audio analysis function
  function analyzeAudioChunk(audioData: any) {
    // Simulate analysis - replace with actual audio processing
    const hasFillerWords = Math.random() > 0.7;
    const hasGrammarIssue = Math.random() > 0.8;
    
    const feedback = [];
    
    if (hasFillerWords) {
      feedback.push({
        type: 'suggestion',
        category: 'fluency',
        message: 'Try to reduce filler words like "um" and "uh"',
        timestamp: new Date()
      });
    }
    
    if (hasGrammarIssue) {
      feedback.push({
        type: 'correction',
        category: 'grammar',
        message: 'Consider using "went" instead of "wen\'t"',
        timestamp: new Date()
      });
    }
    
    if (Math.random() > 0.6) {
      feedback.push({
        type: 'praise',
        category: 'content',
        message: 'Great use of specific examples!',
        timestamp: new Date()
      });
    }
    
    return {
      grammar: feedback.filter(f => f.category === 'grammar'),
      pronunciation: Math.floor(Math.random() * 15) + 85,
      feedback: feedback
    };
  }

  // Session report generation
  function generateSessionReport(sessionData: any) {
    const duration = Math.floor((Date.now() - sessionData.startTime) / 1000);
    const audioChunkCount = sessionData.audioChunks.length;
    
    return {
      sessionId: `session_${sessionData.startTime}`,
      duration: duration,
      totalAudioChunks: audioChunkCount,
      averageConfidence: Math.floor(Math.random() * 15) + 80,
      averageClarity: Math.floor(Math.random() * 20) + 75,
      improvementAreas: [
        'Reduce filler words',
        'Speak more slowly',
        'Use more specific examples'
      ],
      strengths: [
        'Clear articulation',
        'Good eye contact',
        'Confident delivery'
      ]
    };
  }

  return server;
}