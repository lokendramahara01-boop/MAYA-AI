import React from 'react';
import { Mic, Square } from 'lucide-react';

interface MayaOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

export const MayaOrb: React.FC<MayaOrbProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onClick,
}) => {
  return (
    <div className="relative flex items-center justify-center -top-3">
      {/* Outer Glow Halo Waves */}
      <div
        className={`absolute -inset-3 rounded-full blur-xl transition-all duration-500 ${
          isListening
            ? 'bg-cyan-400/60 scale-125 animate-pulse'
            : isSpeaking
            ? 'bg-blue-500/50 scale-110 animate-bounce'
            : isProcessing
            ? 'bg-purple-500/50 scale-110 animate-spin'
            : 'bg-cyan-500/30 group-hover:scale-105'
        }`}
      />

      {/* Ripple Rings */}
      {isListening && (
        <>
          <span className="absolute w-20 h-20 rounded-full border border-cyan-400/60 animate-ping opacity-75" />
          <span className="absolute w-24 h-24 rounded-full border border-sky-400/40 animate-pulse duration-1000" />
        </>
      )}

      {/* Main Orb Button */}
      <button
        onClick={onClick}
        aria-label={isListening ? 'Stop Listening' : 'Start Voice Assistant'}
        title={isListening ? 'Stop Listening (Aawaz rokein)' : 'Talk to Maya (Bolna shuru karein)'}
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/80 shadow-[0_0_25px_rgba(0,229,255,0.9)] transition-all active:scale-95 cursor-pointer ${
          isListening
            ? 'bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 ring-4 ring-cyan-300/60'
            : isSpeaking
            ? 'bg-gradient-to-tr from-blue-500 via-indigo-600 to-cyan-400 ring-2 ring-blue-300/50'
            : 'bg-gradient-to-tr from-cyan-500 via-sky-600 to-blue-700 hover:brightness-110 ring-2 ring-cyan-400/40'
        }`}
      >
        {isListening ? (
          <Square className="w-6 h-6 text-white fill-white rounded-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        ) : (
          <Mic className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        )}
      </button>
    </div>
  );
};
