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

  // Voice recording functionality with performance fixes
  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = () => {
          // Optimized waveform updates
          requestAnimationFrame(() => {
            setVoiceMetrics(prev => ({
              ...prev,
              waveform: Array(30).fill(0).map(() => Math.random() * 100),
              pronunciation: Math.min(98, prev.pronunciation + Math.random() * 3 - 1),
              fluency: Math.min(95, prev.fluency + Math.random() * 2 - 1)
            }));
          });
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

  // Modern CSS-in-JS styles
  const styles = {
    root: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      minHeight: "100vh",
      color: "#ffffff",
      overflow: "hidden"
    },
    dashboard: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 20px",
      position: "relative"
    },
    header: {
      textAlign: "center",
      marginBottom: "60px",
      position: "relative"
    },
    title: {
      fontSize: "clamp(2.5rem, 8vw, 4rem)",
      fontWeight: "800",
      background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f59e0b 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "20px",
      letterSpacing: "-2px"
    },
    subtitle: {
      fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
      color: "#a0a0ab",
      fontWeight: "500",
      marginBottom: "16px"
    },
    tagline: {
      fontSize: "1.125rem",
      color: "#64748b",
      fontStyle: "italic",
      marginBottom: "30px"
    },
    moduleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "30px",
      marginBottom: "40px"
    },
    moduleCard: {
      background: "#16213e",
      borderRadius: "16px",
      padding: "30px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid #0f3460",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transform: "translateZ(0)"
    },
    moduleIcon: {
      fontSize: "3rem",
      marginBottom: "20px",
      display: "block",
      filter: "drop-shadow(0 0 10px rgba(0, 212, 255, 0.3))"
    },
    moduleTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "16px",
      background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    },
    moduleDescription: {
      color: "#a0a0ab",
      fontSize: "0.95rem",
      lineHeight: "1.6"
    },
    backButton: {
      position: "fixed",
      top: "20px",
      left: "20px",
      background: "#16213e",
      border: "1px solid #0f3460",
      borderRadius: "12px",
      padding: "12px 20px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#00d4ff",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000
    },
    dualPanel: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      minHeight: "calc(100vh - 100px)",
      padding: "80px 30px 30px",
      maxWidth: "1400px",
      margin: "0 auto"
    },
    panel: {
      background: "#16213e",
      borderRadius: "16px",
      padding: "30px",
      border: "1px solid #0f3460",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden"
    },
    panelTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "25px",
      color: "#ffffff",
      textAlign: "center"
    },
    waveformContainer: {
      height: "120px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: "3px",
      marginBottom: "30px",
      padding: "20px",
      background: "rgba(15, 52, 96, 0.3)",
      borderRadius: "12px",
      contain: "layout style"
    },
    waveformBar: {
      width: "4px",
      background: isRecording 
        ? "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)" 
        : "rgba(160, 160, 171, 0.3)",
      borderRadius: "2px",
      transition: "height 0.1s ease-out",
      transform: "translateZ(0)",
      boxShadow: isRecording ? "0 0 4px rgba(0, 212, 255, 0.4)" : "none"
    },
    recordButton: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      border: "none",
      background: isRecording 
        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
        : "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
      color: "white",
      fontSize: "2.5rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: isRecording 
        ? "0 0 30px rgba(239, 68, 68, 0.5)" 
        : "0 0 30px rgba(0, 212, 255, 0.3)",
      position: "relative",
      transform: "translateZ(0)"
    },
    contextSelector: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "20px"
    },
    contextButton: {
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #0f3460",
      background: "#1a1a2e",
      color: "#a0a0ab",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "0.85rem",
      fontWeight: "500"
    },
    metricsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "15px",
      marginTop: "25px"
    },
    metricCard: {
      background: "rgba(15, 52, 96, 0.3)",
      borderRadius: "12px",
      padding: "16px",
      textAlign: "center",
      border: "1px solid #0f3460",
      transition: "all 0.3s ease",
      transform: "translateZ(0)"
    },
    metricValue: {
      fontSize: "1.75rem",
      fontWeight: "700",
      background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "6px"
    },
    metricLabel: {
      fontSize: "0.8rem",
      color: "#a0a0ab"
    },
    conversationArea: {
      background: "rgba(15, 52, 96, 0.3)",
      borderRadius: "12px",
      padding: "20px",
      height: "300px",
      overflowY: "auto",
      border: "1px solid #0f3460"
    },
    progressSection: {
      marginTop: "40px",
      padding: "30px",
      background: "rgba(15, 52, 96, 0.2)",
      borderRadius: "16px",
      border: "1px solid #0f3460"
    }
  };

  const renderDashboard = () => (
    <div style={styles.dashboard} className="fixed-layout">
      <div style={styles.header}>
        <h1 style={styles.title}>ChatterPal</h1>
        <p style={styles.subtitle}>AI Speaking Coach</p>
        <p style={styles.tagline}>Overcome foreign language speaking anxiety through contextual practice</p>
        <div style={{ marginTop: "20px", fontSize: "0.875rem", color: "#00d4ff" }}>
          Status: {status} | User: {user?.username || "Loading..."}
        </div>
      </div>

      <div style={styles.moduleGrid} className="stable-grid">
        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("voice-call")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateZ(0) translateY(-4px)";
            e.currentTarget.style.borderColor = "#00d4ff";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 212, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateZ(0) translateY(0)";
            e.currentTarget.style.borderColor = "#0f3460";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={styles.moduleIcon}>📞</span>
          <h3 style={styles.moduleTitle}>Voice Call Simulator</h3>
          <p style={styles.moduleDescription}>
            Real-time AI conversations with pronunciation scoring, grammar analysis, and vocabulary enhancement.
          </p>
        </div>

        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("interview")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateZ(0) translateY(-4px)";
            e.currentTarget.style.borderColor = "#7c3aed";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(124, 58, 237, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateZ(0) translateY(0)";
            e.currentTarget.style.borderColor = "#0f3460";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={styles.moduleIcon}>🤖</span>
          <h3 style={styles.moduleTitle}>AI Interview Chamber</h3>
          <p style={styles.moduleDescription}>
            Practice with adaptive AI avatars. Customizable subjects with real-time performance dashboard.
          </p>
        </div>

        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("seminar")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateZ(0) translateY(-4px)";
            e.currentTarget.style.borderColor = "#f59e0b";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateZ(0) translateY(0)";
            e.currentTarget.style.borderColor = "#0f3460";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={styles.moduleIcon}>🎤</span>
          <h3 style={styles.moduleTitle}>Seminar Simulator</h3>
          <p style={styles.moduleDescription}>
            Virtual audience with dynamic reactions. Advanced speech analysis and AI-generated Q&A sessions.
          </p>
        </div>
      </div>

      <div style={styles.progressSection}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px", color: "#ffffff" }}>
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
    <div style={styles.root} className="voice-container">
      <button 
        style={styles.backButton} 
        onClick={() => setActiveModule("dashboard")}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1a1a2e";
          e.currentTarget.style.borderColor = "#00d4ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#16213e";
          e.currentTarget.style.borderColor = "#0f3460";
        }}
      >
        ← Back to ChatterPal
      </button>

      <div style={styles.dualPanel}>
        {/* Left Panel - Voice Interface */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Voice Call Simulator</h2>

          {/* Context Selection */}
          <div style={{ marginBottom: "25px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "12px", color: "#a0a0ab" }}>
              Choose Conversation Context
            </h3>
            <div style={styles.contextSelector}>
              {["Travel", "Business", "Casual", "Academic", "Social", "Technical"].map((context) => (
                <button
                  key={context}
                  style={{
                    ...styles.contextButton,
                    background: conversationContext === context.toLowerCase() 
                      ? "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)" 
                      : "#1a1a2e",
                    color: conversationContext === context.toLowerCase() ? "#ffffff" : "#a0a0ab",
                    borderColor: conversationContext === context.toLowerCase() ? "#00d4ff" : "#0f3460"
                  }}
                  onClick={() => setConversationContext(context.toLowerCase())}
                >
                  {context}
                </button>
              ))}
            </div>
          </div>

          {/* Waveform Visualization */}
          <div style={styles.waveformContainer} className="voice-wave-container">
            {voiceMetrics.waveform.map((height, index) => (
              <div
                key={index}
                style={{
                  ...styles.waveformBar,
                  height: `${Math.max(8, height)}px`
                }}
                className={isRecording ? "voice-wave-bar active" : "voice-wave-bar"}
              />
            ))}
          </div>

          {/* Record Button */}
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <button
              style={styles.recordButton}
              onClick={handleVoiceRecording}
              className={`voice-button ${isRecording ? 'recording' : ''}`}
            >
              {isRecording ? "⏸️" : "📞"}
            </button>
            {isRecording && (
              <div style={{ marginTop: "12px", color: "#00d4ff", fontSize: "1rem", fontWeight: "600" }}>
                Call Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>

          {/* Metrics */}
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

        {/* Right Panel - Conversation */}
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Live Conversation & Analysis</h2>

          <div style={styles.conversationArea}>
            {isRecording ? (
              <div style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                <div style={{ marginBottom: "15px", padding: "12px", background: "rgba(0, 212, 255, 0.1)", borderRadius: "8px", borderLeft: "3px solid #00d4ff" }}>
                  <strong style={{ color: "#00d4ff" }}>AI:</strong> "That's a great point about sustainable travel! What's been your most memorable eco-friendly experience?"
                </div>
                <div style={{ marginBottom: "12px", padding: "12px", background: "rgba(124, 58, 237, 0.1)", borderRadius: "8px", borderLeft: "3px solid #7c3aed" }}>
                  <strong style={{ color: "#7c3aed" }}>You:</strong> "Well, I <span style={{ textDecoration: "underline", color: "#f59e0b" }}>wen't</span> to Costa Rica..."
                </div>
                <div style={{ fontSize: "0.8rem", color: "#f59e0b", marginBottom: "15px", padding: "8px", background: "rgba(245, 158, 11, 0.1)", borderRadius: "6px" }}>
                  💡 Grammar: "went" not "wen't" | ✨ Great vocabulary usage
                </div>
              </div>
            ) : (
              <div style={{ color: "#64748b", textAlign: "center", padding: "40px 20px", fontStyle: "italic" }}>
                Click the phone button to start your AI conversation practice.
                <br /><br />
                Choose your context above and begin speaking naturally.
              </div>
            )}
          </div>

          {/* Overused Words Alert */}
          {voiceMetrics.overusedWords.length > 0 && (
            <div style={{ marginTop: "20px", padding: "16px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px", color: "#ef4444" }}>
                🔄 Word Variety Suggestions
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#fca5a5" }}>
                Overused: {voiceMetrics.overusedWords.join(", ")}
                <br />
                Try: "indeed", "furthermore", "essentially"
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
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>AI Interview Chamber</h2>
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
                      ? "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)" 
                      : "rgba(15, 23, 42, 0.8)",
                    borderColor: selectedAvatar === avatar.id ? "#00d4ff" : "transparent",
                    boxShadow: selectedAvatar === avatar.id ? "0 0 30px rgba(0, 212, 255, 0.4)" : "0 4px 8px rgba(0, 0, 0, 0.2)"
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

          <button
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(0, 212, 255, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 212, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 212, 255, 0.3)";
            }}
          >
            🚀 Start Interview Session
          </button>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Real-time Performance Dashboard</h2>
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

                  setTimeout(() => setAudienceReaction("neutral"), 30000);
                  setTimeout(() => setAudienceReaction("engaged"), 60000);
                }
              }}
            >
              {seminarTimer > 0 ? "🛑 End Presentation" : "🎤 Start Presentation"}
            </button>
          </div>
        </div>

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
                  <div style={{ marginTop: "20px", padding: "15px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px" }}>
                    <strong style={{ color: "#10b981" }}>📊 Real-time Analysis:</strong>
                    <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
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
    </div>
  );
}

export default App;