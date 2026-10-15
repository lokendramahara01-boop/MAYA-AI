import React from 'react';
import { Mic, MessageSquare, Image as ImageIcon, BookOpen, Sparkles, Heart } from 'lucide-react';

interface FloatingCapsuleProps {
  onSelectAction: (action: string) => void;
  activeAction?: string;
}

export const FloatingCapsule: React.FC<FloatingCapsuleProps> = ({
  onSelectAction,
}) => {
  const items = [
    { id: 'voice_chat', label: 'Voice Chat', icon: Mic },
    { id: 'text_chat', label: 'Text Chat', icon: MessageSquare },
    { id: 'image_video', label: 'Image & Video', icon: ImageIcon },
    { id: 'study_learn', label: 'Study & Learn', icon: BookOpen },
    { id: 'create_assist', label: 'Create & Assist', icon: Sparkles },
    { id: 'always_with_you', label: 'Always With You', icon: Heart, heartColor: true },
  ];

  return (
    <div className="absolute right-3 top-16 z-20 flex flex-col gap-1.5 p-2 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_20px_rgba(0,180,255,0.25)] select-none max-w-[155px]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onSelectAction(item.id)}
            className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs font-medium text-cyan-100 hover:text-white hover:bg-cyan-500/25 border border-transparent hover:border-cyan-400/40 transition-all active:scale-95 cursor-pointer"
          >
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                item.heartColor
                  ? 'text-pink-400 fill-pink-400/30 group-hover:text-pink-300'
                  : 'text-cyan-400 group-hover:text-cyan-200'
              }`}
            />
            <span className="truncate tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
