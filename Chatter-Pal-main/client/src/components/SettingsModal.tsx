
import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export interface AppSettings {
  replyLanguage: string;
  replyFormality: string;
  replyTone: string;
  accentFocus: string;
  difficultyLevel: string;
  feedbackType: string;
  enableMemoryTracking: boolean;
  pronunciationFocus: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const settingsOptions = {
    replyLanguage: ['English', 'Bengali', 'Hindi', 'Spanish', 'French'],
    replyFormality: ['Formal', 'Casual', 'Friendly', 'Professional'],
    replyTone: ['Encouraging', 'Strict', 'Neutral', 'Humorous', 'Empathetic'],
    accentFocus: ['American English', 'British English', 'Neutral'],
    difficultyLevel: ['Beginner', 'Intermediate', 'Advanced'],
    feedbackType: ['Detailed Explanation', 'Summary Only', 'Corrective Only']
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: AppSettings = {
      replyLanguage: 'English',
      replyFormality: 'Friendly',
      replyTone: 'Encouraging',
      accentFocus: 'American English',
      difficultyLevel: 'Intermediate',
      feedbackType: 'Detailed Explanation',
      enableMemoryTracking: true,
      pronunciationFocus: true
    };
    setLocalSettings(defaultSettings);
  };

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
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            ⚙️ Settings
          </h2>
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

        {/* Settings Grid */}
        <div style={{
          display: 'grid',
          gap: '25px'
        }}>
          {/* Language Settings */}
          <div style={{
            background: 'rgba(0, 212, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 212, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#00d4ff',
              marginBottom: '15px'
            }}>
              🌐 Language & Communication
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '8px', display: 'block' }}>
                  Reply Language
                </label>
                <select
                  value={localSettings.replyLanguage}
                  onChange={(e) => setLocalSettings({...localSettings, replyLanguage: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #0f3460',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  {settingsOptions.replyLanguage.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '8px', display: 'block' }}>
                  Reply Formality
                </label>
                <select
                  value={localSettings.replyFormality}
                  onChange={(e) => setLocalSettings({...localSettings, replyFormality: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #0f3460',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  {settingsOptions.replyFormality.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Personality Settings */}
          <div style={{
            background: 'rgba(124, 58, 237, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(124, 58, 237, 0.2)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#7c3aed',
              marginBottom: '15px'
            }}>
              🎭 AI Personality & Tone
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '8px', display: 'block' }}>
                  Reply Tone
                </label>
                <select
                  value={localSettings.replyTone}
                  onChange={(e) => setLocalSettings({...localSettings, replyTone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #0f3460',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  {settingsOptions.replyTone.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '8px', display: 'block' }}>
                  Accent Focus
                </label>
                <select
                  value={localSettings.accentFocus}
                  onChange={(e) => setLocalSettings({...localSettings, accentFocus: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #0f3460',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  {settingsOptions.accentFocus.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Learning Settings */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#f59e0b',
              marginBottom: '15px'
            }}>
              📚 Learning Preferences
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '8px', display: 'block' }}>
                  Difficulty Level
                </label>
                <select
                  value={localSettings.difficultyLevel}
                  onChange={(e) => setLocalSettings({...localSettings, difficultyLevel: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #0f3460',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  {settingsOptions.difficultyLevel.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '8px', display: 'block' }}>
                  Feedback Type
                </label>
                <select
                  value={localSettings.feedbackType}
                  onChange={(e) => setLocalSettings({...localSettings, feedbackType: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #0f3460',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  {settingsOptions.feedbackType.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#10b981',
              marginBottom: '15px'
            }}>
              🔧 Advanced Features
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <label style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                    Enable Memory Tracking
                  </label>
                  <p style={{ fontSize: '12px', color: '#a0a0ab', margin: '4px 0 0 0' }}>
                    Remember past mistakes for personalized feedback
                  </p>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '28px'
                }}>
                  <input
                    type="checkbox"
                    checked={localSettings.enableMemoryTracking}
                    onChange={(e) => setLocalSettings({...localSettings, enableMemoryTracking: e.target.checked})}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: localSettings.enableMemoryTracking ? '#10b981' : '#374151',
                    transition: '0.3s',
                    borderRadius: '28px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '20px',
                      width: '20px',
                      left: localSettings.enableMemoryTracking ? '26px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <label style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                    Pronunciation Focus
                  </label>
                  <p style={{ fontSize: '12px', color: '#a0a0ab', margin: '4px 0 0 0' }}>
                    Get detailed pronunciation tips and corrections
                  </p>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '28px'
                }}>
                  <input
                    type="checkbox"
                    checked={localSettings.pronunciationFocus}
                    onChange={(e) => setLocalSettings({...localSettings, pronunciationFocus: e.target.checked})}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: localSettings.pronunciationFocus ? '#10b981' : '#374151',
                    transition: '0.3s',
                    borderRadius: '28px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '20px',
                      width: '20px',
                      left: localSettings.pronunciationFocus ? '26px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          gap: '15px'
        }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            <RotateCcw size={16} />
            Reset to Default
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(160, 160, 171, 0.1)',
                border: '1px solid rgba(160, 160, 171, 0.3)',
                color: '#a0a0ab',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
              }}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
