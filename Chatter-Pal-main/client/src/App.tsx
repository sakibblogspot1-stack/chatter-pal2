
import { useState, useEffect } from "react";

function App() {
  console.log("ChatterPal AI Speaking Coach is starting...");
  
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [status, setStatus] = useState("Loading...");

  // Voice Call states
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sessionMemory, setSessionMemory] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [conversationContext, setConversationContext] = useState("travel");
  const [callDuration, setCallDuration] = useState(0);
  const [voiceMetrics, setVoiceMetrics] = useState({
    pronunciation: 92,
    fluency: 87,
    vocabulary: 89,
    confidence: "Excellent",
    waveform: Array(30).fill(0).map(() => Math.random() * 100),
    overusedWords: ["actually", "like", "basically"],
    grammarErrors: 2,
    newWords: 5
  });

  // Interview states
  const [selectedAvatar, setSelectedAvatar] = useState("professional");
  const [interviewSubject, setInterviewSubject] = useState("technical");
  const [difficultyLevel, setDifficultyLevel] = useState("adaptive");
  const [interviewMetrics, setInterviewMetrics] = useState({
    responseTime: 3.2,
    clarity: 91,
    relevance: 88,
    confidence: 85,
    knowledgeDepth: "Intermediate"
  });

  // Seminar states
  const [seminarTimer, setSeminarTimer] = useState(0);
  const [teleprompterText, setTeleprompterText] = useState("Welcome to your presentation. Begin speaking when ready...");
  const [audienceSize, setAudienceSize] = useState(45);
  const [audienceReaction, setAudienceReaction] = useState("engaged");
  const [speechMetrics, setSpeechMetrics] = useState({
    pace: "Optimal",
    coherence: 94,
    engagement: 89,
    clarity: 87
  });

  const userId = "ac3507e4-9e2d-4e58-b0f7-2410465f5775";

  useEffect(() => {
    // Load user data
    fetch(`/api/user/${userId}`)
      .then(response => response.json())
      .then(userData => {
        setUser(userData);
        setStatus("Ready");
      })
      .catch(error => {
        console.error("Error loading user:", error);
        setStatus("Error loading user data");
      });

    // Load progress data
    fetch(`/api/user/${userId}/progress`)
      .then(response => response.json())
      .then(progressData => setProgress(progressData))
      .catch(error => console.error("Error loading progress:", error));
  }, [userId]);

  // Voice recording functionality
  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.ondataavailable = () => {
          // Simulate real-time waveform updates
          setVoiceMetrics(prev => ({
            ...prev,
            waveform: Array(30).fill(0).map(() => Math.random() * 100),
            pronunciation: Math.min(98, prev.pronunciation + Math.random() * 3 - 1),
            fluency: Math.min(95, prev.fluency + Math.random() * 2 - 1)
          }));
        };

        recorder.start(100);
        setMediaRecorder(recorder);
        setIsRecording(true);
        setTranscript("AI: Hello! I'm excited to chat with you today. What would you like to talk about?");
        
        // Start call timer
        const startTime = Date.now();
        const timer = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        recorder.addEventListener('stop', () => clearInterval(timer));
        
      } catch (error) {
        console.error("Microphone access denied:", error);
      }
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        setMediaRecorder(null);
      }
      setIsRecording(false);
      setCallDuration(0);
    }
  };

  // CSS-in-JS styles with futuristic design
  const styles = {
    root: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "linear-gradient(135deg, #0a0b1e 0%, #1a1b3a 50%, #2d1b69 100%)",
      minHeight: "100vh",
      color: "#ffffff",
      overflow: "hidden"
    },
    dashboard: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 20px",
      position: "relative" as const
    },
    bgAnimation: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: -1
    },
    floatingParticle: {
      position: "absolute" as const,
      width: "4px",
      height: "4px",
      background: "rgba(99, 102, 241, 0.6)",
      borderRadius: "50%",
      animation: "float 20s infinite linear"
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "60px",
      position: "relative" as const
    },
    title: {
      fontSize: "64px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #00f5ff 0%, #fc00ff 50%, #fffc00 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "20px",
      textShadow: "0 0 30px rgba(0, 245, 255, 0.3)",
      letterSpacing: "-2px"
    },
    subtitle: {
      fontSize: "24px",
      color: "#a5b4fc",
      fontWeight: "500",
      marginBottom: "16px"
    },
    tagline: {
      fontSize: "18px",
      color: "#64748b",
      fontStyle: "italic",
      marginBottom: "30px"
    },
    moduleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: "40px",
      marginBottom: "40px"
    },
    moduleCard: {
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "40px 30px",
      textAlign: "center" as const,
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid rgba(99, 102, 241, 0.2)",
      position: "relative" as const,
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
    },
    moduleIcon: {
      fontSize: "72px",
      marginBottom: "24px",
      display: "block",
      filter: "drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))"
    },
    moduleTitle: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "16px",
      background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    moduleDescription: {
      color: "#94a3b8",
      fontSize: "16px",
      lineHeight: "1.6"
    },
    backButton: {
      position: "fixed" as const,
      top: "30px",
      left: "30px",
      background: "rgba(15, 23, 42, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(99, 102, 241, 0.3)",
      borderRadius: "16px",
      padding: "12px 24px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      color: "#00f5ff",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
    },
    dualPanel: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      height: "calc(100vh - 120px)",
      padding: "60px 30px 30px"
    },
    panel: {
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "30px",
      border: "1px solid rgba(99, 102, 241, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
    },
    waveformContainer: {
      height: "140px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: "3px",
      marginBottom: "30px",
      padding: "20px",
      background: "rgba(0, 0, 0, 0.3)",
      borderRadius: "16px"
    },
    waveformBar: {
      width: "6px",
      background: isRecording 
        ? "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)" 
        : "rgba(148, 163, 184, 0.3)",
      borderRadius: "3px",
      transition: "all 0.1s ease",
      boxShadow: isRecording ? "0 0 8px rgba(0, 245, 255, 0.4)" : "none"
    },
    recordButton: {
      width: "140px",
      height: "140px",
      borderRadius: "50%",
      border: "none",
      background: isRecording 
        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
        : "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)",
      color: "white",
      fontSize: "56px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isRecording 
        ? "0 0 40px rgba(239, 68, 68, 0.6)" 
        : "0 0 40px rgba(0, 245, 255, 0.4)",
      position: "relative" as const
    },
    callInterface: {
      background: "rgba(0, 0, 0, 0.4)",
      borderRadius: "16px",
      padding: "20px",
      marginTop: "20px"
    },
    contextSelector: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "15px",
      marginBottom: "20px"
    },
    contextButton: {
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid rgba(99, 102, 241, 0.3)",
      background: "rgba(15, 23, 42, 0.6)",
      color: "#a5b4fc",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "14px",
      fontWeight: "500"
    },
    metricsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
      marginTop: "30px"
    },
    metricCard: {
      background: "rgba(0, 0, 0, 0.3)",
      borderRadius: "16px",
      padding: "20px",
      textAlign: "center" as const,
      border: "1px solid rgba(99, 102, 241, 0.2)"
    },
    metricValue: {
      fontSize: "32px",
      fontWeight: "700",
      background: "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "8px"
    },
    metricLabel: {
      fontSize: "14px",
      color: "#94a3b8"
    },
    avatarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginBottom: "30px"
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "2px solid transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "40px",
      background: "rgba(15, 23, 42, 0.8)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)"
    },
    auditorium: {
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      borderRadius: "24px",
      padding: "40px",
      textAlign: "center" as const,
      color: "white",
      minHeight: "400px",
      position: "relative" as const,
      border: "1px solid rgba(99, 102, 241, 0.3)"
    },
    timer: {
      fontSize: "72px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "20px",
      textShadow: "0 0 30px rgba(0, 245, 255, 0.3)"
    },
    progressSection: {
      marginTop: "40px",
      padding: "30px",
      background: "rgba(0, 0, 0, 0.2)",
      borderRadius: "20px",
      border: "1px solid rgba(99, 102, 241, 0.2)"
    }
  };

  const renderDashboard = () => (
    <div style={styles.dashboard}>
      {/* Animated Background */}
      <div style={styles.bgAnimation}>
        {Array(50).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.floatingParticle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>ChatterPal</h1>
        <p style={styles.subtitle}>AI Speaking Coach</p>
        <p style={styles.tagline}>Overcome foreign language speaking anxiety through contextual practice</p>
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#6366f1" }}>
          Status: {status} | User: {user?.username || "Loading..."}
        </div>
      </div>

      <div style={styles.moduleGrid}>
        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("voice-call")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-8px)";
            e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.6)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 245, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.2)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
          }}
        >
          <span style={styles.moduleIcon}>📞</span>
          <h3 style={styles.moduleTitle}>Voice Call Simulator</h3>
          <p style={styles.moduleDescription}>
            Real-time AI conversations with pronunciation scoring, grammar analysis, and vocabulary enhancement. Memory-enabled feedback tracks your progress.
          </p>
        </div>

        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("interview")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-8px)";
            e.currentTarget.style.borderColor = "rgba(252, 0, 255, 0.6)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(252, 0, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.2)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
          }}
        >
          <span style={styles.moduleIcon}>🤖</span>
          <h3 style={styles.moduleTitle}>AI Interview Chamber</h3>
          <p style={styles.moduleDescription}>
            Practice with adaptive AI avatars. Customizable subjects with real-time performance dashboard and knowledge depth assessment.
          </p>
        </div>

        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("seminar")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-8px)";
            e.currentTarget.style.borderColor = "rgba(255, 252, 0, 0.6)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(255, 252, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.2)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
          }}
        >
          <span style={styles.moduleIcon}>🎤</span>
          <h3 style={styles.moduleTitle}>Seminar Simulator</h3>
          <p style={styles.moduleDescription}>
            Virtual audience with dynamic reactions. Advanced speech analysis including pace monitoring and AI-generated Q&A sessions.
          </p>
        </div>
      </div>

      <div style={styles.progressSection}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", color: "#ffffff" }}>
          Your Progress Journey
        </h2>
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>127</div>
            <div style={styles.metricLabel}>Sessions Completed</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>89%</div>
            <div style={styles.metricLabel}>Fluency Score</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>45</div>
            <div style={styles.metricLabel}>Mistakes Overcome</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>12</div>
            <div style={styles.metricLabel}>Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVoiceCall = () => (
    <div style={styles.root}>
      <button style={styles.backButton} onClick={() => setActiveModule("dashboard")}>
        ← Back to ChatterPal
      </button>
      
      <div style={styles.dualPanel}>
        {/* Left Panel - Voice Interface */}
        <div style={styles.panel}>
          <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "700", color: "#ffffff" }}>
            Voice Call Simulator
          </h2>

          {/* Context Selection */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#a5b4fc" }}>
              Choose Conversation Context
            </h3>
            <div style={styles.contextSelector}>
              {["Travel", "Business", "Casual", "Academic", "Social", "Technical"].map((context) => (
                <button
                  key={context}
                  style={{
                    ...styles.contextButton,
                    background: conversationContext === context.toLowerCase() 
                      ? "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)" 
                      : "rgba(15, 23, 42, 0.6)",
                    color: conversationContext === context.toLowerCase() ? "#ffffff" : "#a5b4fc"
                  }}
                  onClick={() => setConversationContext(context.toLowerCase())}
                >
                  {context}
                </button>
              ))}
            </div>
          </div>
          
          {/* Waveform Visualization */}
          <div style={styles.waveformContainer}>
            {voiceMetrics.waveform.map((height, index) => (
              <div
                key={index}
                style={{
                  ...styles.waveformBar,
                  height: `${Math.max(8, height)}px`
                }}
              />
            ))}
          </div>

          {/* Record Button */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <button
              style={styles.recordButton}
              onClick={handleVoiceRecording}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isRecording ? "⏸️" : "📞"}
            </button>
            {isRecording && (
              <div style={{ marginTop: "15px", color: "#00f5ff", fontSize: "18px", fontWeight: "600" }}>
                Call Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>

          {/* Advanced Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{voiceMetrics.pronunciation}%</div>
              <div style={styles.metricLabel}>Pronunciation</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{voiceMetrics.fluency}%</div>
              <div style={styles.metricLabel}>Fluency</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{voiceMetrics.grammarErrors}</div>
              <div style={styles.metricLabel}>Grammar Fixes</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{voiceMetrics.newWords}</div>
              <div style={styles.metricLabel}>New Words</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Conversation & Analysis */}
        <div style={styles.panel}>
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "700", color: "#ffffff" }}>
            Live Conversation & Analysis
          </h2>
          
          <div style={styles.callInterface}>
            {isRecording ? (
              <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
                <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 245, 255, 0.1)", borderRadius: "12px", borderLeft: "4px solid #00f5ff" }}>
                  <strong style={{ color: "#00f5ff" }}>AI:</strong> "That's a great point about sustainable travel! I'm curious - what's been your most memorable eco-friendly travel experience?"
                </div>
                <div style={{ marginBottom: "15px", padding: "15px", background: "rgba(252, 0, 255, 0.1)", borderRadius: "12px", borderLeft: "4px solid #fc00ff" }}>
                  <strong style={{ color: "#fc00ff" }}>You:</strong> "Well, I <span style={{ textDecoration: "underline", textDecorationColor: "#fbbf24" }}>wen't</span> to Costa Rica last year and stayed at this amazing <span style={{ color: "#10b981", cursor: "pointer" }}>eco-lodge</span>..."
                </div>
                <div style={{ fontSize: "14px", color: "#fbbf24", marginBottom: "20px", padding: "10px", background: "rgba(251, 191, 36, 0.1)", borderRadius: "8px" }}>
                  💡 Grammar: "went" not "wen't" | ✨ Great vocabulary: "eco-lodge"
                </div>
                <div style={{ marginTop: "20px", padding: "15px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "12px" }}>
                  <strong style={{ color: "#6366f1" }}>Memory Bank:</strong> Remembering your interest in sustainable travel for future conversations...
                </div>
              </div>
            ) : (
              <div style={{ color: "#64748b", textAlign: "center", padding: "60px 20px", fontStyle: "italic" }}>
                Click the phone button to start your AI conversation practice. 
                <br /><br />
                Choose your context above and begin speaking naturally. 
                The AI will engage in conversation while analyzing your speech patterns.
              </div>
            )}
          </div>

          {/* Overused Words Alert */}
          {voiceMetrics.overusedWords.length > 0 && (
            <div style={{ marginTop: "20px", padding: "20px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px", color: "#ef4444" }}>
                🔄 Word Variety Suggestions
              </h3>
              <div style={{ fontSize: "14px", color: "#fca5a5" }}>
                Overused: {voiceMetrics.overusedWords.join(", ")}
                <br />
                Try: "indeed", "furthermore", "essentially" instead
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInterview = () => (
    <div style={styles.root}>
      <button style={styles.backButton} onClick={() => setActiveModule("dashboard")}>
        ← Back to ChatterPal
      </button>
      
      <div style={styles.dualPanel}>
        {/* Left Panel - AI Avatars */}
        <div style={styles.panel}>
          <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "700", color: "#ffffff" }}>
            AI Interview Chamber
          </h2>
          
          <div style={styles.avatarGrid}>
            {[
              { id: "professional", emoji: "👨‍💼", name: "Executive", personality: "Formal & Analytical" },
              { id: "friendly", emoji: "😊", name: "Mentor", personality: "Supportive & Encouraging" },
              { id: "technical", emoji: "👩‍💻", name: "Expert", personality: "Technical & Precise" }
            ].map((avatar) => (
              <div key={avatar.id} style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...styles.avatar,
                    background: selectedAvatar === avatar.id 
                      ? "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)" 
                      : "rgba(15, 23, 42, 0.8)",
                    borderColor: selectedAvatar === avatar.id ? "#00f5ff" : "transparent",
                    boxShadow: selectedAvatar === avatar.id ? "0 0 30px rgba(0, 245, 255, 0.4)" : "0 4px 16px rgba(0, 0, 0, 0.2)"
                  }}
                  onClick={() => setSelectedAvatar(avatar.id)}
                >
                  {avatar.emoji}
                </div>
                <div style={{ marginTop: "12px", fontSize: "16px", fontWeight: "600", color: "#ffffff" }}>
                  {avatar.name}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {avatar.personality}
                </div>
              </div>
            ))}
          </div>

          {/* Subject & Difficulty Selection */}
          <div style={{ marginTop: "30px", space: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#a5b4fc" }}>Interview Subject</h3>
              <select
                value={interviewSubject}
                onChange={(e) => setInterviewSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontSize: "16px",
                  background: "rgba(15, 23, 42, 0.8)",
                  color: "#ffffff",
                  backdropFilter: "blur(10px)"
                }}
              >
                <option value="technical">Technical Skills</option>
                <option value="behavioral">Behavioral Questions</option>
                <option value="leadership">Leadership Experience</option>
                <option value="creative">Creative Problem Solving</option>
                <option value="industry">Industry Knowledge</option>
              </select>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#a5b4fc" }}>Difficulty Level</h3>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontSize: "16px",
                  background: "rgba(15, 23, 42, 0.8)",
                  color: "#ffffff",
                  backdropFilter: "blur(10px)"
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="adaptive">Adaptive (AI Adjusts)</option>
              </select>
            </div>
          </div>

          {/* Start Interview Button */}
          <button
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0, 245, 255, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 245, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 245, 255, 0.3)";
            }}
          >
            🚀 Start Interview Session
          </button>
        </div>

        {/* Right Panel - Performance Metrics */}
        <div style={styles.panel}>
          <h2 style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "700", color: "#ffffff" }}>
            Real-time Performance Dashboard
          </h2>
          
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{interviewMetrics.responseTime}s</div>
              <div style={styles.metricLabel}>Response Time</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{interviewMetrics.clarity}%</div>
              <div style={styles.metricLabel}>Clarity Score</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{interviewMetrics.relevance}%</div>
              <div style={styles.metricLabel}>Relevance</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{interviewMetrics.confidence}%</div>
              <div style={styles.metricLabel}>Confidence</div>
            </div>
          </div>

          {/* Live Interview Feedback */}
          <div style={{ 
            background: "rgba(0, 0, 0, 0.4)", 
            borderRadius: "16px", 
            padding: "25px", 
            height: "300px", 
            overflowY: "auto",
            marginTop: "30px",
            border: "1px solid rgba(99, 102, 241, 0.2)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", color: "#ffffff" }}>
              Interview Progress
            </h3>
            <div style={{ fontSize: "16px", lineHeight: "1.7", color: "#e2e8f0" }}>
              <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 245, 255, 0.1)", borderRadius: "12px", borderLeft: "4px solid #00f5ff" }}>
                <strong style={{ color: "#00f5ff" }}>AI Interviewer:</strong> "Describe a challenging project you led and how you overcame obstacles."
              </div>
              <div style={{ marginBottom: "15px", padding: "15px", background: "rgba(252, 0, 255, 0.1)", borderRadius: "12px", borderLeft: "4px solid #fc00ff" }}>
                <strong style={{ color: "#fc00ff" }}>You:</strong> "In my previous role, I was responsible for..."
              </div>
              <div style={{ marginTop: "20px", padding: "15px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px" }}>
                <strong style={{ color: "#10b981" }}>💡 AI Analysis:</strong> 
                <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                  <li>Strong opening with specific context ✓</li>
                  <li>Use STAR method for better structure</li>
                  <li>Knowledge depth: {interviewMetrics.knowledgeDepth}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeminar = () => (
    <div style={styles.root}>
      <button style={styles.backButton} onClick={() => setActiveModule("dashboard")}>
        ← Back to ChatterPal
      </button>
      
      <div style={styles.dualPanel}>
        {/* Left Panel - Virtual Auditorium */}
        <div style={styles.panel}>
          <div style={styles.auditorium}>
            <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "30px", color: "#ffffff" }}>
              Virtual Auditorium
            </h2>
            
            <div style={styles.timer}>
              {String(Math.floor(seminarTimer / 60)).padStart(2, '0')}:
              {String(seminarTimer % 60).padStart(2, '0')}
            </div>
            
            <div style={{ fontSize: "20px", marginBottom: "20px", color: "#a5b4fc" }}>
              Audience: {audienceSize} participants
            </div>
            
            <div style={{ fontSize: "18px", marginBottom: "30px", color: "#94a3b8" }}>
              Audience Mood: <span style={{ 
                color: audienceReaction === "engaged" ? "#10b981" : 
                      audienceReaction === "neutral" ? "#f59e0b" : "#ef4444",
                fontWeight: "600"
              }}>
                {audienceReaction.charAt(0).toUpperCase() + audienceReaction.slice(1)} 
                {audienceReaction === "engaged" ? " 😊" : audienceReaction === "neutral" ? " 😐" : " 😴"}
              </span>
            </div>

            {/* Audience visualization */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(8, 1fr)", 
              gap: "8px", 
              maxWidth: "320px", 
              margin: "0 auto 30px" 
            }}>
              {Array(32).fill(0).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: Math.random() > 0.15 ? 
                      (audienceReaction === "engaged" ? "#10b981" : 
                       audienceReaction === "neutral" ? "#f59e0b" : "#64748b") : "#374151",
                    opacity: Math.random() > 0.1 ? 1 : 0.4,
                    animation: audienceReaction === "engaged" ? "pulse 2s infinite" : "none"
                  }}
                />
              ))}
            </div>

            {/* Speech Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", marginBottom: "30px" }}>
              <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "15px", borderRadius: "12px" }}>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#00f5ff" }}>
                  {speechMetrics.pace}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Speaking Pace</div>
              </div>
              <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "15px", borderRadius: "12px" }}>
                <div style={{ fontSize: "18px", fontWeight: "600", color: "#fc00ff" }}>
                  {speechMetrics.coherence}%
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Coherence</div>
              </div>
            </div>

            <button
              style={{
                padding: "15px 30px",
                background: seminarTimer > 0 ? 
                  "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : 
                  "linear-gradient(135deg, #00f5ff 0%, #fc00ff 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: seminarTimer > 0 ? 
                  "0 8px 24px rgba(239, 68, 68, 0.4)" : 
                  "0 8px 24px rgba(0, 245, 255, 0.4)"
              }}
              onClick={() => {
                if (seminarTimer > 0) {
                  setSeminarTimer(0);
                } else {
                  const interval = setInterval(() => {
                    setSeminarTimer(prev => prev + 1);
                  }, 1000);
                  
                  // Simulate audience reactions
                  setTimeout(() => setAudienceReaction("neutral"), 30000);
                  setTimeout(() => setAudienceReaction("engaged"), 60000);
                }
              }}
            >
              {seminarTimer > 0 ? "🛑 End Presentation" : "🎤 Start Presentation"}
            </button>
          </div>
        </div>

        {/* Right Panel - Teleprompter & Q&A */}
        <div style={styles.panel}>
          <h2 style={{ marginBottom: "25px", fontSize: "24px", fontWeight: "700", color: "#ffffff" }}>
            Smart Teleprompter & AI Q&A
          </h2>
          
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#a5b4fc" }}>
              📝 Speaking Notes
            </h3>
            <textarea
              value={teleprompterText}
              onChange={(e) => setTeleprompterText(e.target.value)}
              style={{
                width: "100%",
                height: "180px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "16px",
                lineHeight: "1.6",
                resize: "none",
                color: "#ffffff",
                backdropFilter: "blur(10px)"
              }}
              placeholder="Enter your presentation notes here... AI will generate relevant questions based on your content."
            />
          </div>

          {/* Q&A Transcript Panel */}
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#ffffff" }}>
              🤖 AI-Generated Q&A Session
            </h3>
            <div style={{
              background: "rgba(0, 0, 0, 0.4)",
              borderRadius: "16px",
              padding: "25px",
              height: "250px",
              overflowY: "auto",
              border: "1px solid rgba(99, 102, 241, 0.2)"
            }}>
              {seminarTimer > 0 ? (
                <div style={{ fontSize: "15px", lineHeight: "1.7" }}>
                  <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 245, 255, 0.1)", borderRadius: "12px", borderLeft: "4px solid #00f5ff" }}>
                    <strong style={{ color: "#00f5ff" }}>AI Generated Question:</strong> "Based on your presentation content, how would you handle resistance to change in implementation?"
                  </div>
                  <div style={{ marginBottom: "15px", padding: "15px", background: "rgba(252, 0, 255, 0.1)", borderRadius: "12px", borderLeft: "4px solid #fc00ff" }}>
                    <strong style={{ color: "#fc00ff" }}>Your Response:</strong> "That's an excellent question. Change management requires..."
                  </div>
                  <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px" }}>
                    <strong style={{ color: "#10b981" }}>📊 Real-time Analysis:</strong>
                    <ul style={{ marginTop: "10px", color: "#94a3b8", fontSize: "14px" }}>
                      <li>• Engagement Level: {speechMetrics.engagement}%</li>
                      <li>• Speaking Clarity: {speechMetrics.clarity}%</li>
                      <li>• Audience Attention: High</li>
                    </ul>
                  </div>
                  <div style={{ color: "#64748b", fontStyle: "italic", textAlign: "center", marginTop: "20px" }}>
                    🎯 AI continues generating contextual questions...
                  </div>
                </div>
              ) : (
                <div style={{ color: "#64748b", fontStyle: "italic", textAlign: "center", paddingTop: "80px" }}>
                  Start your presentation to see AI-generated questions and real-time audience feedback analysis.
                  <br /><br />
                  📈 Advanced features: Pace monitoring, coherence scoring, and dynamic audience reactions.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (activeModule === "voice-call") return renderVoiceCall();
  if (activeModule === "interview") return renderInterview();
  if (activeModule === "seminar") return renderSeminar();
  
  return (
    <div style={styles.root}>
      {renderDashboard()}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default App;
