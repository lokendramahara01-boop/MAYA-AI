import React, { useState, useEffect } from 'react';
import { X, Newspaper, Volume2, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { fetchCuratedNews } from '../services/api';
import { NewsArticle } from '../types/assistant';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeakText: (text: string) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  onSpeakText,
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All News (सभी समाचार)' },
    { id: 'technology', label: 'Technology (तकनीक)' },
    { id: 'science', label: 'Science / ISRO' },
    { id: 'sports', label: 'Sports (खेल)' },
    { id: 'weather', label: 'Weather (मौसम)' },
  ];

  const loadNews = async (cat: string) => {
    setLoading(true);
    const data = await fetchCuratedNews(cat);
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadNews(selectedCategory);
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-cyan-400/40 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.3)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-400/20 bg-blue-950/40">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">MAYA Hindi News Bulletin</h2>
              <p className="text-[10px] text-cyan-300/80">Real-time curated news summarized in Hindi</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => loadNews(selectedCategory)}
              className="p-1.5 rounded-full text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-cyan-500/10 bg-slate-900/60 select-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 text-xs px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'text-cyan-300/60 hover:text-cyan-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-cyan-300/60">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-cyan-400" />
              <span className="text-xs">Taza khabrein retrieve ho rahi hain...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center text-cyan-300/60 text-xs">
              Koi samachar uplabdh nahi hai. Kripya refresh karein.
            </div>
          ) : (
            articles.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-blue-950/40 border border-cyan-500/20 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-cyan-300/80 mb-1.5 font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/20 text-cyan-300">
                    {item.source}
                  </span>
                  <span>{item.time}</span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug mb-1.5">{item.title}</h3>
                <p className="text-xs text-cyan-100/80 leading-relaxed mb-3">{item.summary}</p>
                <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10">
                  <button
                    onClick={() => onSpeakText(`${item.title}। ${item.summary}`)}
                    className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white font-medium cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    Sunayein (Listen in Hindi)
                  </button>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-cyan-400/80 hover:text-cyan-200"
                  >
                    Source Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
