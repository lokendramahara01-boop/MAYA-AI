import React from 'react';
import {
  X,
  Languages,
  Cpu,
  ShieldCheck,
  Smartphone,
  Download,
  Info,
  CheckCircle2,
  ExternalLink,
  Github,
} from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hindi' | 'hinglish' | 'english';
  onLanguageChange: (lang: 'hindi' | 'hinglish' | 'english') => void;
  provider: 'gemini' | 'openai';
  onProviderChange: (provider: 'gemini' | 'openai') => void;
  onOpenAndroidCode: () => void;
  onOpenPhoneControls: () => void;
  onOpenCuteVoice: () => void;
  onOpenBackgroundModal: () => void;
  onOpenGitHubExport: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  provider,
  onProviderChange,
  onOpenAndroidCode,
  onOpenPhoneControls,
  onOpenCuteVoice,
  onOpenBackgroundModal,
  onOpenGitHubExport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-slate-950 border-r border-cyan-400/30 flex flex-col shadow-[10px_0_35px_rgba(0,180,255,0.25)]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-400/20 bg-blue-950/50">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">MAYA Settings</h2>
              <p className="text-[10px] text-cyan-300/80">Voice, AI Engine & Android Services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-cyan-100">
          {/* Voice Language Preference */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
              <Languages className="w-4 h-4 text-cyan-400" />
              Assistant Voice Language
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hindi', label: 'Hindi (हिंदी)' },
                { id: 'hinglish', label: 'Hinglish' },
                { id: 'english', label: 'English' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onLanguageChange(item.id as any)}
                  className={`py-2 px-2 rounded-xl text-center font-medium transition-all active:scale-95 cursor-pointer ${
                    language === item.id
                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/70 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                      : 'bg-blue-950/30 text-cyan-300/60 border border-cyan-500/20 hover:text-cyan-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Intelligence Provider */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              AI Reasoning Engine
            </div>
            <div className="space-y-2">
              <label
                onClick={() => onProviderChange('gemini')}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  provider === 'gemini'
                    ? 'bg-blue-950/70 border-cyan-400/60 shadow-[0_0_15px_rgba(0,180,255,0.2)]'
                    : 'bg-slate-900/40 border-cyan-500/20 text-cyan-300/60'
                }`}
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    Google Gemini 3.8 Flash
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Recommended
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-300/70 mt-0.5">
                    Fast multilingual speech & multimodal vision
                  </div>
                </div>
                {provider === 'gemini' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </label>

              <label
                onClick={() => onProviderChange('openai')}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  provider === 'openai'
                    ? 'bg-blue-950/70 border-cyan-400/60 shadow-[0_0_15px_rgba(0,180,255,0.2)]'
                    : 'bg-slate-900/40 border-cyan-500/20 text-cyan-300/60'
                }`}
              >
                <div>
                  <div className="font-bold text-white">OpenAI Backend (GPT-4o)</div>
                  <div className="text-[10px] text-cyan-300/70 mt-0.5">
                    Connected through secure backend server
                  </div>
                </div>
                {provider === 'openai' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </label>
            </div>
          </div>

          {/* Android Permissions Status */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Android System Permissions
            </div>
            <div className="space-y-1.5 p-3 rounded-2xl bg-blue-950/30 border border-cyan-500/20">
              {[
                { name: 'Microphone (Audio Record)', granted: true },
                { name: 'Camera & Torch', granted: true },
                { name: 'Phone Calls & Dialer Intent', granted: true },
                { name: 'WhatsApp & App Launchers', granted: true },
                { name: 'Accessibility Service', note: 'Authorized only' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1 text-[11px]">
                  <span className="text-cyan-200">{p.name}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {p.note || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cute Girl Voice & Background Actions */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenCuteVoice();
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/50 border border-pink-400/40 hover:border-pink-300 text-left transition-all active:scale-95 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>🌸</span> Cute Girl Voice Studio
                </div>
                <div className="text-[10px] text-pink-300/80 mt-0.5">
                  Change voice pitch, tone & Kawaii presets
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/30">
                Configure
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenBackgroundModal();
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/50 border border-cyan-400/40 hover:border-cyan-300 text-left transition-all active:scale-95 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>🖼️</span> Change Background Wallpaper
                </div>
                <div className="text-[10px] text-cyan-300/80 mt-0.5">
                  Red dress girl, neon bedroom, or upload photo
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Change
              </span>
            </button>
          </div>

          {/* Project Source and Downloader button */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenGitHubExport();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-300/30"
            >
              <Github className="w-4 h-4 text-cyan-200" />
              Export GitHub Repo (.ZIP)
            </button>

            <button
              onClick={onOpenAndroidCode}
              className="w-full py-2 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Android Project (.ZIP)
            </button>

            <button
              onClick={onOpenPhoneControls}
              className="w-full py-2 px-4 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-200 font-semibold text-xs hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Open Phone Control Center
            </button>
          </div>

          {/* About Maya AI */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-cyan-500/10 text-[10px] text-cyan-400/60 leading-relaxed flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              MAYA AI v2.5.0 • Personal AI Assistant & Android Phone Controller. Background character and cyber neon aesthetics preserved offline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
