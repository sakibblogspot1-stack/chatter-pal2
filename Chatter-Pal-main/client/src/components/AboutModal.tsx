
import React from 'react';
import { X, Github, Heart, Zap, Shield, Users } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#16213e',
        borderRadius: '20px',
        padding: '40px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f59e0b 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
            }}>
              🤖
            </div>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                ChatterPal
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#a0a0ab',
                margin: 0
              }}>
                AI Speaking Coach v2.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#ef4444',
              transition: 'all 0.3s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mission Statement */}
        <div style={{
          background: 'rgba(0, 212, 255, 0.05)',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          marginBottom: '25px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#00d4ff',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Heart size={20} />
            Our Mission
          </h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#e2e8f0',
            margin: 0
          }}>
            ChatterPal empowers language learners to overcome speaking anxiety through AI-powered conversation practice. 
            We believe that confident communication opens doors to endless opportunities, and our platform provides a 
            safe, personalized environment for learners to practice and improve their speaking skills.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'rgba(124, 58, 237, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(124, 58, 237, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <Zap size={18} style={{ color: '#7c3aed' }} />
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#7c3aed',
                margin: 0
              }}>
                AI-Powered Analysis
              </h4>
            </div>
            <p style={{
              fontSize: '13px',
              color: '#a0a0ab',
              lineHeight: '1.5',
              margin: 0
            }}>
              Real-time pronunciation scoring, grammar analysis, and personalized feedback powered by advanced AI.
            </p>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <Shield size={18} style={{ color: '#f59e0b' }} />
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f59e0b',
                margin: 0
              }}>
                Safe Practice Environment
              </h4>
            </div>
            <p style={{
              fontSize: '13px',
              color: '#a0a0ab',
              lineHeight: '1.5',
              margin: 0
            }}>
              Practice without judgment in our supportive AI environment. Build confidence at your own pace.
            </p>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <Users size={18} style={{ color: '#10b981' }} />
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#10b981',
                margin: 0
              }}>
                Adaptive Learning
              </h4>
            </div>
            <p style={{
              fontSize: '13px',
              color: '#a0a0ab',
              lineHeight: '1.5',
              margin: 0
            }}>
              Personalized learning paths that adapt to your progress and learning style for optimal results.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '25px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '20px'
          }}>
            ✨ Key Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00d4ff' }}>📞</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Voice Call Simulator</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#7c3aed' }}>🤖</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>AI Interview Practice</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#f59e0b' }}>🎤</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Seminar Simulation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#10b981' }}>🧠</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Memory Tracking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#ef4444' }}>📊</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Progress Analytics</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#8b5cf6' }}>🎯</span>
              <span style={{ fontSize: '14px', color: '#e2e8f0' }}>Personalized Feedback</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            margin: '0 0 15px 0'
          }}>
            Built with ❤️ for language learners worldwide
          </p>
          <p style={{
            fontSize: '12px',
            color: '#475569',
            margin: 0
          }}>
            © 2024 ChatterPal. Empowering confident communication through AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
