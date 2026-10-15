import React, { useState } from 'react';
import { X, Volume2, Sparkles, Heart, Wand2, Music2, Check, Sliders } from 'lucide-react';
import { CUTE_VOICE_PRESETS, CuteVoicePreset, speechService } from '../services/speech';

interface CuteVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPresetId: string;
  onSelectPreset: (preset: CuteVoicePreset) => void;
}

export const CuteVoiceModal: React.FC<CuteVoiceModalProps> = ({
  isOpen,
  onClose,
  selectedPresetId,
  onSelectPreset,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlaySample = (preset: CuteVoicePreset) => {
    setPlayingId(preset.id);
    speechService.speak(
      preset.sampleGreeting,
      undefined,
      () => setPlayingId(null),
      preset.pitch,
      preset.rate
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-slate-950 border border-cyan-400/50 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.35)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-400/20 bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-blue-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                MAYA Cute Girl Voice Studio
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h2>
              <p className="text-[10px] text-cyan-300/80">Sweet, Kawaii & Friendly Voice Personas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Presets List */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {CUTE_VOICE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isPlaying = playingId === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-950/90 via-purple-950/50 to-blue-950/90 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)]'
                    : 'bg-blue-950/30 border-cyan-500/20 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{preset.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                        {preset.hindiName}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-200/80 leading-relaxed mb-2">
                      {preset.description}
                    </p>
                    <div className="text-[11px] text-cyan-300/90 italic bg-slate-900/60 p-2 rounded-xl border border-cyan-500/15">
                      &ldquo;{preset.sampleGreeting}&rdquo;
                    </div>
                  </div>

                  {/* Actions: Listen sample & Select indicator */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySample(preset);
                      }}
                      title="Play Voice Sample"
                      className={`p-2 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                        isPlaying
                          ? 'bg-pink-500 text-white shadow-[0_0_12px_#ec4899] animate-pulse'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/40 hover:text-white'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_8px_#00e5ff]">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Pitch/Rate Indicators */}
                <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] text-cyan-400/70">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-cyan-400" />
                    Cute Pitch: {preset.pitch.toFixed(2)}x
                  </span>
                  <span>Tempo: {preset.rate.toFixed(2)}x</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-900/60 border-t border-cyan-500/15 flex items-center justify-between">
          <span className="text-xs text-cyan-300/80">
            Selected voice will speak all Maya Hindi and English responses.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_0_12px_rgba(0,229,255,0.5)] active:scale-95 cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
