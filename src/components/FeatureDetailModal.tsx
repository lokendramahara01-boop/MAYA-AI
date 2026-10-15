import React from 'react';
import { X, BookOpen, Edit3, Cloud, Heart, Sparkles, Volume2, Send } from 'lucide-react';
import { WeatherData } from '../types/assistant';

interface FeatureDetailModalProps {
  type: 'study' | 'journal' | 'weather' | 'mood' | 'always' | null;
  onClose: () => void;
  weather: WeatherData;
  onSpeakText: (text: string) => void;
  onAddJournalEntry?: (entry: string) => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  type,
  onClose,
  weather,
  onSpeakText,
  onAddJournalEntry,
}) => {
  const [journalInput, setJournalInput] = React.useState('');
  const [journalEntries, setJournalEntries] = React.useState<string[]>([
    'Aaj ka din bohot productive raha. Maya ke saath naya Android project banaya!',
    'Morning walk par thandi hawa thi aur suhavna mausam tha.',
  ]);

  if (!type) return null;

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalInput.trim()) return;
    setJournalEntries([journalInput.trim(), ...journalEntries]);
    if (onAddJournalEntry) onAddJournalEntry(journalInput.trim());
    setJournalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-slate-950 border border-cyan-400/40 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.3)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-400/20 bg-blue-950/50">
          <div className="flex items-center gap-2">
            {type === 'study' && <BookOpen className="w-5 h-5 text-cyan-400" />}
            {type === 'journal' && <Edit3 className="w-5 h-5 text-cyan-400" />}
            {type === 'weather' && <Cloud className="w-5 h-5 text-cyan-400" />}
            {(type === 'mood' || type === 'always') && <Heart className="w-5 h-5 text-pink-400 fill-pink-500/20" />}
            <div>
              <h2 className="text-sm font-bold text-white capitalize">
                {type === 'study' && 'Study & Learn with Maya'}
                {type === 'journal' && 'Personal Journal & Reflections'}
                {type === 'weather' && 'Weather & Climate Details'}
                {type === 'mood' && 'Emotional Resonance & Mood'}
                {type === 'always' && 'Always With You — Maya Friend'}
              </h2>
              <p className="text-[10px] text-cyan-300/80">Interactive companion features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content per feature */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-cyan-100">
          {type === 'study' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-950/50 border border-cyan-500/30">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Aaj Ka Topic: Android Jetpack Compose
                </div>
                <p className="leading-relaxed text-cyan-100/90">
                  Jetpack Compose Android ka modern declarative UI toolkit hai. Isme XML files ki jarurat nahi padti, balki Kotlin code me hi UI define hoti hai!
                </p>
                <button
                  onClick={() =>
                    onSpeakText(
                      'Jetpack Compose Android ka modern declarative UI toolkit hai. Isme XML files ki jarurat nahi padti, balki seedhe Kotlin code me UI banate hain!'
                    )
                  }
                  className="mt-2.5 flex items-center gap-1.5 text-cyan-300 hover:text-white font-medium cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  Sunayein (Explain in Voice)
                </button>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                  Hindi Voice Assistant Commands to Practice:
                </div>
                {[
                  'Hey Maya, YouTube par Arijit Singh ka gaana bajao',
                  'Rahul ko phone lagao',
                  'Flashlight on karo',
                  'Aaj ka weather kaisa hai?',
                ].map((cmd, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-cyan-200"
                  >
                    🗣️ &ldquo;{cmd}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'journal' && (
            <div className="space-y-3">
              <form onSubmit={handleJournalSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={journalInput}
                  onChange={(e) => setJournalInput(e.target.value)}
                  placeholder="Aaj ka naya vichar ya yaad likhein..."
                  className="flex-1 bg-slate-900 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-cyan-500 text-white font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2">
                {journalEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-blue-950/40 border border-cyan-500/20 text-white leading-relaxed"
                  >
                    &ldquo;{entry}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}

          {type === 'weather' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/80 to-slate-950/90 border border-cyan-400/50 text-center">
                <div className="text-2xl font-black text-white">{weather.city}</div>
                <div className="text-4xl font-extrabold text-cyan-300 my-2">{weather.temperature}°C</div>
                <div className="text-sm font-semibold text-cyan-100">{weather.condition}</div>
                <p className="text-xs text-cyan-300/70 mt-1">{weather.forecast}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-blue-950/40 border border-cyan-500/20 text-center">
                  <div className="text-[10px] text-cyan-400 uppercase font-semibold">Humidity</div>
                  <div className="text-lg font-bold text-white mt-0.5">{weather.humidity}%</div>
                </div>
                <div className="p-3 rounded-2xl bg-blue-950/40 border border-cyan-500/20 text-center">
                  <div className="text-[10px] text-cyan-400 uppercase font-semibold">Wind Speed</div>
                  <div className="text-lg font-bold text-white mt-0.5">{weather.windSpeed} km/h</div>
                </div>
              </div>
            </div>
          )}

          {(type === 'mood' || type === 'always') && (
            <div className="space-y-3 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-400/40 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(244,114,182,0.4)]">
                <Heart className="w-8 h-8 text-pink-400 fill-pink-400/30 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">
                {type === 'always' ? 'Always With You, Every Moment' : 'Maya Mood: Warm & All Good'}
              </h3>
              <p className="text-xs text-cyan-100/90 leading-relaxed max-w-xs mx-auto">
                &quot;जानू, मैं हमेशा आपके साथ हूँ। चाहे आपको गाने सुनने हों, फोन चलाना हो, या सिर्फ दिल की बात कहनी हो — आपकी माया हमेशा हाज़िर है! 💕&quot;
              </p>
              <button
                onClick={() =>
                  onSpeakText(
                    'जानू, मैं हमेशा आपके साथ हूँ। चाहे आपको गाने सुनने हों, पढ़ाई करनी हो या दिल की बात कहनी हो, आपकी माया हमेशा आपके पास है! 💕'
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/40 hover:bg-pink-500/30 transition-all font-semibold active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                Listen in Maya&apos;s Voice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
