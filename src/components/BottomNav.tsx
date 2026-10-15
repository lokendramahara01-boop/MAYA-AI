import React from 'react';
import { Home, Scan, Brain, MessageSquare } from 'lucide-react';
import { MayaOrb } from './MayaOrb';

interface BottomNavProps {
  activeTab: 'home' | 'scan' | 'memories' | 'chat';
  onTabChange: (tab: 'home' | 'scan' | 'memories' | 'chat') => void;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onOrbClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  isListening,
  isSpeaking,
  isProcessing,
  onOrbClick,
}) => {
  return (
    <nav className="relative z-30 w-full px-4 pt-1 pb-4 bg-gradient-to-t from-slate-950/95 via-blue-950/80 to-transparent backdrop-blur-md select-none">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'
              : 'text-cyan-300/60 hover:text-cyan-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider">Home</span>
        </button>

        {/* Scan */}
        <button
          onClick={() => onTabChange('scan')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'scan'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'
              : 'text-cyan-300/60 hover:text-cyan-200'
          }`}
        >
          <Scan className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider">Scan</span>
        </button>

        {/* Central Orb */}
        <MayaOrb
          isListening={isListening}
          isSpeaking={isSpeaking}
          isProcessing={isProcessing}
          onClick={onOrbClick}
        />

        {/* Memories */}
        <button
          onClick={() => onTabChange('memories')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'memories'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'
              : 'text-cyan-300/60 hover:text-cyan-200'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider">Memories</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => onTabChange('chat')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'chat'
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'
              : 'text-cyan-300/60 hover:text-cyan-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider">Chat</span>
        </button>
      </div>
    </nav>
  );
};
