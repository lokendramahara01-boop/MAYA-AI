import React, { useRef, useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles, Smartphone, ArrowUpRight, Copy, Check } from 'lucide-react';
import { ChatMessage, PhoneAction } from '../types/assistant';

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSpeakMessage: (text: string) => void;
  onExecuteAction: (action: PhoneAction) => void;
  onQuickCommand: (command: string) => void;
  isSpeaking: boolean;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({
  isOpen,
  onClose,
  messages,
  onSpeakMessage,
  onExecuteAction,
  onQuickCommand,
  isSpeaking,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Maya, I love you 💕',
    'Janu, YouTube par gaana chalao 🎵',
    'Janu, flashlight on karo 🔦',
    'Janu, aaj ki news batao 📰',
    'Janu, Rahul ko WhatsApp bhejo',
    'Janu, phone ki settings kholo ⚙️',
    'Janu, aaj ka mausam kaisa hai?',
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg mx-auto h-[85vh] flex flex-col bg-slate-950/95 border-t border-cyan-400/40 rounded-t-3xl shadow-[0_-10px_35px_rgba(0,180,255,0.3)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-400/20 bg-blue-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/60">
              <img src="/assets/maya_bg.jpg" alt="Maya" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                MAYA Voice & Chat
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-[10px] text-cyan-300/80">Hindi • Hinglish • English Assistant</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Command Suggestions */}
        <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar select-none bg-blue-950/20">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onQuickCommand(prompt)}
              className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-cyan-950/60 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 transition-all active:scale-95 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cyan-200/60">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-cyan-500/10 border border-cyan-400/30 mb-3 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-white mb-1">Namaste! Main MAYA hu.</h3>
              <p className="text-xs max-w-xs leading-relaxed text-cyan-300/70">
                Aap mujhse Hindi, English ya Hinglish me baat kar sakte hain. Mic dabaiye ya koi phone command boliye!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`relative max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-blue-950/80 border border-cyan-400/40 text-cyan-50 shadow-[0_0_15px_rgba(0,180,255,0.15)]'
                        : 'bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-[0_0_15px_rgba(0,140,255,0.3)]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Action Card Attachment if Action was triggered */}
                    {msg.action && msg.action.type !== 'CHAT' && (
                      <div className="mt-2.5 pt-2 border-t border-cyan-400/20">
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/70 border border-cyan-400/30">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                            <div className="truncate">
                              <div className="text-[11px] font-bold text-cyan-300">
                                {msg.action.type.replace('_', ' ')}: {msg.action.target || msg.action.query || ''}
                              </div>
                              <div className="text-[10px] text-cyan-200/70 truncate">
                                {msg.action.explanation}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => msg.action && onExecuteAction(msg.action)}
                            className="shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-100 border border-cyan-400/40 active:scale-95 transition-all cursor-pointer"
                          >
                            Execute
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons (Listen / Copy) */}
                    {isAssistant && (
                      <div className="mt-2 flex items-center justify-between text-[11px] text-cyan-300/60 pt-1 border-t border-cyan-400/10">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSpeakMessage(msg.content)}
                            title="Listen Voice"
                            className="p-1 rounded hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all cursor-pointer"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-pink-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy text"
                            className="p-1 rounded hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
