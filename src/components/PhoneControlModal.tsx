import React from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Youtube,
  MessageCircle,
  PhoneCall,
  Flashlight,
  Settings,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PhoneAction } from '../types/assistant';

interface PhoneControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAction: PhoneAction | null;
  onConfirmAction: (action: PhoneAction) => void;
  onCancelAction: () => void;
  torchState: boolean;
  onToggleTorch: () => void;
}

export const PhoneControlModal: React.FC<PhoneControlModalProps> = ({
  isOpen,
  onClose,
  pendingAction,
  onConfirmAction,
  onCancelAction,
  torchState,
  onToggleTorch,
}) => {
  if (!isOpen) return null;

  const quickActions = [
    {
      title: 'YouTube Music',
      desc: 'Play songs & videos',
      icon: Youtube,
      color: 'text-red-400',
      action: {
        type: 'PLAY_MUSIC' as const,
        target: 'youtube',
        query: 'Latest Hindi Songs',
        explanation: 'Opening YouTube to play top Hindi music',
        requiresConfirmation: false,
      },
    },
    {
      title: 'WhatsApp Message',
      desc: 'Prepare voice message',
      icon: MessageCircle,
      color: 'text-emerald-400',
      action: {
        type: 'SEND_WHATSAPP' as const,
        target: 'whatsapp',
        recipient: 'Friend',
        message: 'Hello! Sent via Maya AI Assistant.',
        explanation: 'Opening WhatsApp compose intent',
        requiresConfirmation: true,
      },
    },
    {
      title: 'Phone Dialer',
      desc: 'Open keypad or call',
      icon: PhoneCall,
      color: 'text-sky-400',
      action: {
        type: 'CALL_PHONE' as const,
        target: 'phone',
        recipient: '100',
        explanation: 'Opening Android phone dialer',
        requiresConfirmation: true,
      },
    },
    {
      title: 'Android Settings',
      desc: 'Open phone configuration',
      icon: Settings,
      color: 'text-purple-400',
      action: {
        type: 'OPEN_SETTINGS' as const,
        target: 'settings',
        explanation: 'Dispatching android.settings.SETTINGS intent',
        requiresConfirmation: false,
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-950 border border-cyan-400/40 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.3)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-400/20 bg-blue-950/40">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Android Phone Action Registry</h2>
              <p className="text-[10px] text-cyan-300/80">Safe execution & authorization gate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Pending Action Confirmation Card */}
          {pendingAction && (
            <div className="p-4 rounded-2xl bg-blue-950/80 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Action Verification Required
              </div>

              <div className="text-sm font-semibold text-white">
                {pendingAction.type.replace('_', ' ')}
              </div>
              <p className="text-xs text-cyan-200/80 mt-1 leading-relaxed">
                {pendingAction.explanation || 'Maya is ready to dispatch this phone action.'}
              </p>

              {pendingAction.recipient && (
                <div className="mt-2 text-xs text-cyan-300 font-mono bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                  Target: {pendingAction.recipient}
                </div>
              )}
              {pendingAction.message && (
                <div className="mt-1 text-xs text-cyan-200 font-mono bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                  Message: &quot;{pendingAction.message}&quot;
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => onConfirmAction(pendingAction)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-[0_0_12px_rgba(0,229,255,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Launch Intent
                </button>
                <button
                  onClick={onCancelAction}
                  className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-200 text-xs font-medium active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Flashlight Quick Control */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                torchState
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                  : 'bg-slate-800 text-cyan-400'
              }`}>
                <Flashlight className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Camera Torch / Flashlight</div>
                <div className="text-[11px] text-cyan-300/70">
                  {torchState ? 'Torch is currently ON 🔦' : 'Torch is currently OFF'}
                </div>
              </div>
            </div>
            <button
              onClick={onToggleTorch}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                torchState
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/40'
              }`}
            >
              {torchState ? 'Turn OFF' : 'Turn ON'}
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Supported Android Intents
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((qa, idx) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onConfirmAction(qa.action)}
                    className="p-3 rounded-2xl bg-blue-950/40 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-blue-950/70 text-left transition-all active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${qa.color} group-hover:scale-110 transition-transform`} />
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-300" />
                    </div>
                    <div className="text-xs font-bold text-white">{qa.title}</div>
                    <div className="text-[10px] text-cyan-300/70 truncate mt-0.5">{qa.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Android Safety Boundary Notice */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-[11px] text-cyan-300/80 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Safety Policy:</strong> Maya never executes arbitrary shell commands or bypasses Android lock screens (PIN, fingerprint, biometric). All sensitive calls and messages require explicit user authorization.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
