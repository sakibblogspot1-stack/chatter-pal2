import { useState, useEffect } from "react";

function App() {
  console.log("VoiceCoach App is starting...");
  
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [status, setStatus] = useState("Loading...");

  // Voice Call states
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sessionMemory, setSessionMemory] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [voiceMetrics, setVoiceMetrics] = useState({
    clarity: 85,
    confidence: "Good",
    waveform: Array(20).fill(0).map(() => Math.random() * 100)
  });

  // Interview states
  const [selectedAvatar, setSelectedAvatar] = useState("professional");
  const [interviewSubject, setInterviewSubject] = useState("technical");
  const [interviewMetrics, setInterviewMetrics] = useState({
    eyeContact: 78,
    bodyLanguage: 82,
    responseTime: "Good"
  });

  // Seminar states
  const [seminarTimer, setSeminarTimer] = useState(0);
  const [teleprompterText, setTeleprompterText] = useState("Welcome to your presentation. Begin speaking when ready...");
  const [audienceSize, setAudienceSize] = useState(45);

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
            waveform: Array(20).fill(0).map(() => Math.random() * 100),
            clarity: Math.min(95, prev.clarity + Math.random() * 4 - 2)
          }));
        };

        recorder.start(100);
        setMediaRecorder(recorder);
        setIsRecording(true);
        setTranscript("Listening for speech patterns...");
        
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
      setTranscript("");
    }
  };

  // CSS-in-JS styles using your design specifications
  const styles = {
    root: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#F9FAFB",
      minHeight: "100vh",
      color: "#1F2937"
    },
    dashboard: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px"
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "60px"
    },
    title: {
      fontSize: "48px",
      fontWeight: "700",
      background: "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "16px"
    },
    subtitle: {
      fontSize: "20px",
      color: "#6B7280",
      fontWeight: "400"
    },
    moduleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "30px",
      marginBottom: "40px"
    },
    moduleCard: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "40px 30px",
      textAlign: "center" as const,
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative" as const,
      overflow: "hidden"
    },
    moduleIcon: {
      fontSize: "64px",
      marginBottom: "20px",
      display: "block"
    },
    moduleTitle: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "#1F2937"
    },
    moduleDescription: {
      color: "#6B7280",
      fontSize: "16px",
      lineHeight: "1.6"
    },
    backButton: {
      position: "fixed" as const,
      top: "30px",
      left: "30px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "none",
      borderRadius: "12px",
      padding: "12px 20px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "500",
      color: "#4A80F0",
      transition: "all 0.3s ease"
    },
    dualPanel: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      height: "calc(100vh - 120px)",
      padding: "60px 30px 30px"
    },
    panel: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "30px",
      overflow: "hidden"
    },
    waveformContainer: {
      height: "120px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: "4px",
      marginBottom: "30px"
    },
    waveformBar: {
      width: "8px",
      background: isRecording ? "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)" : "#E5E7EB",
      borderRadius: "4px",
      transition: "all 0.1s ease"
    },
    recordButton: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      border: "none",
      background: isRecording ? "#EF4444" : "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)",
      color: "white",
      fontSize: "48px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
    },
    transcript: {
      background: "#F9FAFB",
      borderRadius: "12px",
      padding: "20px",
      height: "300px",
      overflowY: "auto" as const,
      fontSize: "16px",
      lineHeight: "1.6",
      border: "1px solid #E5E7EB"
    },
    avatarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginBottom: "30px"
    },
    avatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "4px solid transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "48px"
    },
    auditorium: {
      background: "linear-gradient(180deg, #1F2937 0%, #374151 100%)",
      borderRadius: "20px",
      padding: "40px",
      textAlign: "center" as const,
      color: "white",
      minHeight: "400px",
      position: "relative" as const
    },
    timer: {
      fontSize: "72px",
      fontWeight: "700",
      color: "#6EE7B7",
      marginBottom: "20px"
    },
    teleprompter: {
      background: "rgba(0, 0, 0, 0.3)",
      borderRadius: "12px",
      padding: "20px",
      fontSize: "18px",
      lineHeight: "1.8",
      maxHeight: "200px",
      overflowY: "auto" as const
    }
  };

  const renderDashboard = () => (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1 style={styles.title}>VoiceCoach AI</h1>
        <p style={styles.subtitle}>Master your communication with AI-powered coaching</p>
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#10B981" }}>
          Status: {status} | User: {user?.username || "Loading..."}
        </div>
      </div>

      <div style={styles.moduleGrid}>
        <div 
          style={{
            ...styles.moduleCard,
            transform: "scale(1)",
            background: "rgba(255, 255, 255, 0.9)"
          }}
          onClick={() => setActiveModule("voice-call")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.borderImage = "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%) 1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.borderImage = "none";
          }}
        >
          <span style={styles.moduleIcon}>🎤</span>
          <h3 style={styles.moduleTitle}>Voice Call</h3>
          <p style={styles.moduleDescription}>
            Real-time AI coaching with dynamic feedback and mistake highlighting during natural conversations
          </p>
        </div>

        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("interview")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
          }}
        >
          <span style={styles.moduleIcon}>👥</span>
          <h3 style={styles.moduleTitle}>Interview</h3>
          <p style={styles.moduleDescription}>
            Practice with AI avatars in realistic interview scenarios with performance metrics
          </p>
        </div>

        <div 
          style={styles.moduleCard}
          onClick={() => setActiveModule("seminar")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
          }}
        >
          <span style={styles.moduleIcon}>🎭</span>
          <h3 style={styles.moduleTitle}>Seminar</h3>
          <p style={styles.moduleDescription}>
            Virtual auditorium presentations with teleprompter and Q&A transcript panel
          </p>
        </div>
      </div>
    </div>
  );

  const renderVoiceCall = () => (
    <div style={styles.root}>
      <button style={styles.backButton} onClick={() => setActiveModule("dashboard")}>
        ← Dashboard
      </button>
      
      <div style={styles.dualPanel}>
        {/* Left Panel - Voice Visualizer */}
        <div style={styles.panel}>
          <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "24px", fontWeight: "600" }}>
            AI Voice Coach
          </h2>
          
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
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isRecording ? "🛑" : "🎤"}
            </button>
          </div>

          {/* Session Controls */}
          <div style={{ textAlign: "center" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px" }}>
              <input
                type="checkbox"
                checked={sessionMemory}
                onChange={(e) => setSessionMemory(e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              Session Memory
            </label>
          </div>

          {/* Metrics */}
          <div style={{ marginTop: "30px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={{ textAlign: "center", padding: "15px", background: "#F0F9FF", borderRadius: "12px" }}>
                <div style={{ fontSize: "24px", fontWeight: "600", color: "#3B82F6" }}>
                  {Math.round(voiceMetrics.clarity)}%
                </div>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>Clarity</div>
              </div>
              <div style={{ textAlign: "center", padding: "15px", background: "#F0FDF4", borderRadius: "12px" }}>
                <div style={{ fontSize: "24px", fontWeight: "600", color: "#10B981" }}>
                  {voiceMetrics.confidence}
                </div>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>Confidence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Real-time Transcript */}
        <div style={styles.panel}>
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>
            Live Transcript & Feedback
          </h2>
          
          <div style={styles.transcript}>
            {isRecording ? (
              <div>
                <p style={{ color: "#6B7280", marginBottom: "15px" }}>🔴 Recording in progress...</p>
                <p style={{ marginBottom: "10px" }}>
                  "Hello, I'm practicing my <span style={{ textDecoration: "underline", textDecorationColor: "#F59E0B" }}>presentashun</span> skills today."
                </p>
                <div style={{ fontSize: "12px", color: "#F59E0B", marginBottom: "15px" }}>
                  💡 Pronunciation: "presentation" (pre-zen-TAY-shun)
                </div>
                <p style={{ marginBottom: "10px" }}>
                  "I want to <span style={{ color: "#10B981", cursor: "pointer", textDecoration: "underline" }}>improve</span> my communication abilities."
                </p>
                <div style={{ fontSize: "12px", color: "#10B981", marginBottom: "15px" }}>
                  ✨ Good word choice! Alternative: "enhance", "develop", "refine"
                </div>
              </div>
            ) : (
              <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>
                Click the microphone to start your voice coaching session. 
                Real-time feedback will appear here with grammar corrections, pronunciation tips, and vocabulary suggestions.
              </p>
            )}
          </div>

          {/* Dynamic Feedback Panel */}
          <div style={{ marginTop: "20px", padding: "20px", background: "#FFFBEB", borderRadius: "12px", border: "1px solid #FED7AA" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px", color: "#92400E" }}>
              AI Coach Insights
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
              <li style={{ marginBottom: "8px", color: "#92400E" }}>• Speak 15% slower for better clarity</li>
              <li style={{ marginBottom: "8px", color: "#92400E" }}>• Great use of varied vocabulary</li>
              <li style={{ marginBottom: "8px", color: "#92400E" }}>• Consider pausing between main points</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterview = () => (
    <div style={styles.root}>
      <button style={styles.backButton} onClick={() => setActiveModule("dashboard")}>
        ← Dashboard
      </button>
      
      <div style={styles.dualPanel}>
        {/* Left Panel - AI Avatars */}
        <div style={styles.panel}>
          <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "24px", fontWeight: "600" }}>
            Choose Your Interviewer
          </h2>
          
          <div style={styles.avatarGrid}>
            {[
              { id: "professional", emoji: "👨‍💼", name: "Professional" },
              { id: "friendly", emoji: "😊", name: "Friendly" },
              { id: "technical", emoji: "👩‍💻", name: "Technical" }
            ].map((avatar) => (
              <div key={avatar.id} style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...styles.avatar,
                    background: selectedAvatar === avatar.id ? "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)" : "#F3F4F6",
                    borderColor: selectedAvatar === avatar.id ? "#3B82F6" : "transparent"
                  }}
                  onClick={() => setSelectedAvatar(avatar.id)}
                >
                  {avatar.emoji}
                </div>
                <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: "500" }}>
                  {avatar.name}
                </div>
              </div>
            ))}
          </div>

          {/* Subject Selection */}
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>Interview Subject</h3>
            <select
              value={interviewSubject}
              onChange={(e) => setInterviewSubject(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                fontSize: "16px",
                background: "white"
              }}
            >
              <option value="technical">Technical Skills</option>
              <option value="behavioral">Behavioral Questions</option>
              <option value="leadership">Leadership Experience</option>
              <option value="general">General Interview</option>
            </select>
          </div>

          {/* Start Interview Button */}
          <button
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "30px",
              background: "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Start Interview Session
          </button>
        </div>

        {/* Right Panel - Performance Metrics */}
        <div style={styles.panel}>
          <h2 style={{ marginBottom: "30px", fontSize: "24px", fontWeight: "600" }}>
            Performance Dashboard
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            <div style={{ textAlign: "center", padding: "20px", background: "#F0F9FF", borderRadius: "12px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>👁️</div>
              <div style={{ fontSize: "24px", fontWeight: "600", color: "#3B82F6" }}>
                {interviewMetrics.eyeContact}%
              </div>
              <div style={{ fontSize: "14px", color: "#6B7280" }}>Eye Contact</div>
            </div>
            
            <div style={{ textAlign: "center", padding: "20px", background: "#F0FDF4", borderRadius: "12px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🤝</div>
              <div style={{ fontSize: "24px", fontWeight: "600", color: "#10B981" }}>
                {interviewMetrics.bodyLanguage}%
              </div>
              <div style={{ fontSize: "14px", color: "#6B7280" }}>Body Language</div>
            </div>
          </div>

          {/* Live Interview Feedback */}
          <div style={{ 
            background: "#F9FAFB", 
            borderRadius: "12px", 
            padding: "20px", 
            height: "250px", 
            overflowY: "auto"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px" }}>
              Interview Progress
            </h3>
            <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#4B5563" }}>
              <p style={{ marginBottom: "10px" }}>
                <strong>Interviewer:</strong> "Tell me about your greatest professional achievement."
              </p>
              <p style={{ marginBottom: "10px", color: "#6B7280" }}>
                <strong>You:</strong> Waiting for response...
              </p>
              <div style={{ marginTop: "15px", padding: "10px", background: "#EBF8FF", borderRadius: "8px" }}>
                <strong style={{ color: "#1E40AF" }}>AI Tip:</strong> Use the STAR method (Situation, Task, Action, Result) for structured responses.
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
        ← Dashboard
      </button>
      
      <div style={styles.dualPanel}>
        {/* Left Panel - Virtual Auditorium */}
        <div style={styles.panel}>
          <div style={styles.auditorium}>
            <h2 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "30px" }}>
              Virtual Auditorium
            </h2>
            
            <div style={styles.timer}>
              {String(Math.floor(seminarTimer / 60)).padStart(2, '0')}:
              {String(seminarTimer % 60).padStart(2, '0')}
            </div>
            
            <div style={{ fontSize: "18px", marginBottom: "30px", color: "#D1D5DB" }}>
              Audience: {audienceSize} participants
            </div>

            {/* Audience visualization */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(8, 1fr)", 
              gap: "8px", 
              maxWidth: "300px", 
              margin: "0 auto" 
            }}>
              {Array(24).fill(0).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: Math.random() > 0.2 ? "#6EE7B7" : "#374151",
                    opacity: Math.random() > 0.1 ? 1 : 0.3
                  }}
                />
              ))}
            </div>

            <button
              style={{
                marginTop: "30px",
                padding: "12px 24px",
                background: seminarTimer > 0 ? "#EF4444" : "#10B981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer"
              }}
              onClick={() => {
                if (seminarTimer > 0) {
                  setSeminarTimer(0);
                } else {
                  // Start timer simulation
                  setInterval(() => {
                    setSeminarTimer(prev => prev + 1);
                  }, 1000);
                }
              }}
            >
              {seminarTimer > 0 ? "End Presentation" : "Start Presentation"}
            </button>
          </div>
        </div>

        {/* Right Panel - Teleprompter & Q&A */}
        <div style={styles.panel}>
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>
            Teleprompter & Q&A
          </h2>
          
          <div style={styles.teleprompter}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#1F2937" }}>
              Speaking Notes
            </h3>
            <textarea
              value={teleprompterText}
              onChange={(e) => setTeleprompterText(e.target.value)}
              style={{
                width: "100%",
                height: "150px",
                background: "transparent",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                lineHeight: "1.6",
                resize: "none",
                color: "#1F2937"
              }}
              placeholder="Enter your presentation notes here..."
            />
          </div>

          {/* Q&A Transcript Panel */}
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
              Q&A Transcript
            </h3>
            <div style={{
              background: "#F9FAFB",
              borderRadius: "12px",
              padding: "20px",
              height: "200px",
              overflowY: "auto",
              border: "1px solid #E5E7EB"
            }}>
              {seminarTimer > 0 ? (
                <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  <p style={{ marginBottom: "10px", color: "#6B7280" }}>
                    <strong>Audience:</strong> "What's your main takeaway from this presentation?"
                  </p>
                  <p style={{ marginBottom: "10px", color: "#4B5563" }}>
                    <strong>You:</strong> "The key point I want everyone to remember is..."
                  </p>
                  <p style={{ marginBottom: "10px", color: "#6B7280" }}>
                    <strong>Audience:</strong> "How does this apply to real-world scenarios?"
                  </p>
                  <div style={{ color: "#9CA3AF", fontStyle: "italic", marginTop: "15px" }}>
                    Live Q&A session in progress...
                  </div>
                </div>
              ) : (
                <div style={{ color: "#9CA3AF", fontStyle: "italic", textAlign: "center", paddingTop: "60px" }}>
                  Questions and answers will appear here during your presentation
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