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

  // WebSocket setup
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket connection established");

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Received message:", message.type);

        // Echo back for demo
        ws.send(JSON.stringify({
          type: "feedback",
          data: { message: "Session started successfully" }
        }));
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  return server;
}