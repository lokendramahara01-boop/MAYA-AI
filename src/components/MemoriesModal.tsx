import React, { useState } from 'react';
import { X, Brain, Plus, Trash2, Tag, Calendar } from 'lucide-react';
import { AssistantMemory } from '../types/assistant';

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: AssistantMemory[];
  onAddMemory: (category: AssistantMemory['category'], content: string) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AssistantMemory['category']>('preference');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddMemory(category, content.trim());
    setContent('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-950 border border-cyan-400/40 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.3)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-400/20 bg-blue-950/40">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">MAYA Memories & Context</h2>
              <p className="text-[10px] text-cyan-300/80">Persistent knowledge learned about you</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="p-1.5 rounded-full text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-4 border-b border-cyan-500/20 bg-blue-950/30 space-y-3">
            <div className="text-xs font-semibold text-cyan-200">Teach Maya a new memory:</div>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. My favorite singer is Arijit Singh"
              className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400"
            />
            <div className="flex items-center justify-between">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="bg-slate-900 border border-cyan-500/40 rounded-lg px-2.5 py-1 text-xs text-cyan-200 focus:outline-none"
              >
                <option value="preference">Preference</option>
                <option value="contact">Contact</option>
                <option value="reminder">Reminder</option>
                <option value="fact">Personal Fact</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-[0_0_10px_rgba(0,229,255,0.4)] active:scale-95 cursor-pointer"
              >
                Save Memory
              </button>
            </div>
          </form>
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {memories.length === 0 ? (
            <div className="py-12 text-center text-cyan-300/60 text-xs">
              Abhi koi memory save nahi hai. &apos;+&apos; dabakar Maya ko naye facts sikhayein!
            </div>
          ) : (
            memories.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-950/40 border border-cyan-500/20 hover:border-cyan-400/40 transition-all group"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] uppercase font-bold text-cyan-300">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-cyan-400/40 flex items-center gap-1 ml-2">
                      <Calendar className="w-2.5 h-2.5" />
                      {m.date}
                    </span>
                  </div>
                  <div className="text-xs text-white leading-relaxed">{m.content}</div>
                </div>
                <button
                  onClick={() => onDeleteMemory(m.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
