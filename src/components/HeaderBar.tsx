import React from 'react';
import { Menu, Crown, Bell, Sparkles, Github } from 'lucide-react';

interface HeaderBarProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenCuteVoice: () => void;
  onOpenBackgroundModal: () => void;
  onOpenGitHubExport: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  unreadCount?: number;
  currentBg: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenMenu,
  onOpenNotifications,
  onOpenProfile,
  onOpenCuteVoice,
  onOpenBackgroundModal,
  onOpenGitHubExport,
  isListening,
  isSpeaking,
  unreadCount = 1,
  currentBg,
}) => {
  return (
    <header className="relative z-30 w-full flex items-center justify-between px-4 py-3 select-none">
      {/* Menu Hamburger */}
      <button
        onClick={onOpenMenu}
        aria-label="Open Navigation Menu"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-950/40 border border-cyan-400/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_12px_rgba(0,229,255,0.2)] active:scale-95 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Maya Branding Center */}
      <div className="flex flex-col items-center justify-center cursor-pointer group" onClick={onOpenProfile}>
        <div className="flex items-center gap-1.5 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]">
          <Crown className="w-5 h-5 text-cyan-300 animate-pulse fill-cyan-400/20" />
          <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-300 bg-clip-text text-transparent filter drop-shadow-[0_2px_8px_rgba(0,180,255,0.7)]">
            Maya
          </span>
        </div>
        <div className="flex items-center gap-1 -mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : isListening ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-400/60'}`} />
          <span className="text-[10px] tracking-wider uppercase font-semibold text-cyan-300/80">
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Online • AI Friend'}
          </span>
        </div>
      </div>

      {/* Right icons: Cute Voice, Background, Notifications + Profile */}
      <div className="flex items-center gap-1.5">
        {/* Cute Voice Shortcut */}
        <button
          onClick={onOpenCuteVoice}
          title="Cute Girl Voice Settings (क्यूट आवाज़ बदलें)"
          className="h-9 px-2.5 rounded-full flex items-center gap-1 bg-pink-950/40 border border-pink-400/40 text-pink-300 hover:text-white hover:bg-pink-500/25 transition-all active:scale-95 cursor-pointer text-[11px] font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Voice</span>
        </button>

        {/* Change Background Shortcut */}
        <button
          onClick={onOpenBackgroundModal}
          title="Change Background (बैकग्राउंड बदलें)"
          className="h-9 px-2.5 rounded-full flex items-center gap-1 bg-blue-950/40 border border-cyan-400/40 text-cyan-300 hover:text-white hover:bg-cyan-500/25 transition-all active:scale-95 cursor-pointer text-[11px] font-semibold"
        >
          <span className="text-xs">🖼️</span>
          <span className="hidden sm:inline">BG</span>
        </button>

        {/* GitHub Full Export Shortcut */}
        <button
          onClick={onOpenGitHubExport}
          title="Export Complete GitHub Project (.ZIP)"
          className="h-9 px-2.5 rounded-full flex items-center gap-1 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-400/50 text-cyan-200 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] transition-all active:scale-95 cursor-pointer text-[11px] font-bold"
        >
          <Github className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>

        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full flex items-center justify-center bg-blue-950/40 border border-cyan-400/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse" />
          )}
        </button>

        <button
          onClick={onOpenProfile}
          aria-label="Maya Profile"
          className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-400/60 shadow-[0_0_14px_rgba(0,229,255,0.4)] active:scale-95 cursor-pointer group"
        >
          <img
            src={currentBg}
            alt="Maya AI"
            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>
    </header>
  );
};
