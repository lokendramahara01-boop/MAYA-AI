import React, { useRef } from 'react';
import { X, Image as ImageIcon, Check, Upload, Sparkles } from 'lucide-react';

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBg: string;
  onSelectBg: (bgUrl: string) => void;
}

export const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  currentBg,
  onSelectBg,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const bgOptions = [
    {
      id: 'purple_dress',
      url: '/assets/maya_purple_dress.jpg',
      title: 'Purple Kurti Girl (New)',
      subtitle: 'रॉयल पर्पल कुर्ती व सुनहरी धूप',
      badge: 'Latest',
    },
    {
      id: 'red_dress',
      url: '/assets/maya_red_dress.jpg',
      title: 'Cute Red Dress Girl',
      subtitle: 'पारंपरिक लाल कुर्ती व टेक बैकग्राउंड',
      badge: 'Popular',
    },
    {
      id: 'neon_room',
      url: '/assets/maya_bg.jpg',
      title: 'Cyber Neon Bedroom',
      subtitle: 'नीला नियॉन कमरा व बर्फीले पहाड़',
      badge: 'Cyberpunk',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSelectBg(reader.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-slate-950 border border-cyan-400/50 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.35)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-400/20 bg-blue-950/50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                MAYA AI Background Studio
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h2>
              <p className="text-[10px] text-cyan-300/80">Choose or upload Maya&apos;s wallpaper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Background Options */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {bgOptions.map((opt) => {
              const isSelected = currentBg === opt.url;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onSelectBg(opt.url);
                    onClose();
                  }}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer aspect-[9/16] max-h-[220px] ${
                    isSelected
                      ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.6)] ring-2 ring-cyan-300/60'
                      : 'border-cyan-500/30 hover:border-cyan-400/70 hover:scale-[1.02]'
                  }`}
                >
                  <img
                    src={opt.url}
                    alt={opt.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/40">
                        {opt.badge}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_8px_#00e5ff]">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white drop-shadow leading-tight">
                        {opt.title}
                      </div>
                      <div className="text-[10px] text-cyan-200/80 line-clamp-1 mt-0.5">
                        {opt.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Upload Option */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 rounded-2xl bg-slate-900/90 border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            Upload Custom Image from Phone (गैलरी से फोटो लगाएं)
          </button>
        </div>
      </div>
    </div>
  );
};
