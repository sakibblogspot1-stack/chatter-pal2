
import React, { useState } from 'react';
import { Settings, Info, ChevronDown } from 'lucide-react';

interface NavigationProps {
  onSettingsClick: () => void;
  onAboutClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSettingsClick, onAboutClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(22, 33, 62, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Logo and App Name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{
          width: '45px',
          height: '45px',
          background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f59e0b 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
        }}>
          🤖
        </div>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            lineHeight: '1.2'
          }}>
            ChatterPal
          </h1>
          <p style={{
            fontSize: '12px',
            color: '#a0a0ab',
            margin: 0,
            fontWeight: '500'
          }}>
            AI Speaking Coach
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button
          onClick={onAboutClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            e.currentTarget.style.color = '#00d4ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <Info size={16} />
          About
        </button>

        <button
          onClick={onSettingsClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            color: '#00d4ff',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
            e.currentTarget.style.borderColor = '#00d4ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
          }}
        >
          <Settings size={16} />
          Settings
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
