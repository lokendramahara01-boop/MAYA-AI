import React from 'react';
import { Music, BookOpen, Edit3, Cloud, Calendar, Heart } from 'lucide-react';
import { WeatherData } from '../types/assistant';

interface ActionCardsProps {
  onMusicClick: () => void;
  onStudyClick: () => void;
  onJournalClick: () => void;
  onWeatherClick: () => void;
  onTodayClick: () => void;
  onMoodClick: () => void;
  weather: WeatherData;
  moodState: { mood: string; status: string };
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  onMusicClick,
  onStudyClick,
  onJournalClick,
  onWeatherClick,
  onTodayClick,
  onMoodClick,
  weather,
  moodState,
}) => {
  const today = new Date();
  const dayNumber = today.getDate();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = today.toLocaleDateString('en-US', { month: 'short' });

  return (
    <div className="w-full space-y-2.5 px-3 z-20 select-none">
      {/* 3 Interactive Pills: Music, Study, Journal */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={onMusicClick}
          className="group relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-b from-blue-950/70 to-blue-900/60 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_15px_rgba(0,180,255,0.25)] hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Music className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-white tracking-wide">Music</span>
        </button>

        <button
          onClick={onStudyClick}
          className="group relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-b from-blue-950/70 to-blue-900/60 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_15px_rgba(0,180,255,0.25)] hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-white tracking-wide">Study</span>
        </button>

        <button
          onClick={onJournalClick}
          className="group relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-gradient-to-b from-blue-950/70 to-blue-900/60 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_15px_rgba(0,180,255,0.25)] hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all active:scale-95 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Edit3 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-white tracking-wide">Journal</span>
        </button>
      </div>

      {/* 3 Status Cards: Weather, Today, Mood */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Weather Card */}
        <button
          onClick={onWeatherClick}
          className="flex flex-col justify-between p-3 rounded-2xl bg-gradient-to-b from-slate-950/70 to-blue-950/60 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_15px_rgba(0,140,255,0.2)] hover:border-cyan-300 transition-all text-left active:scale-95 cursor-pointer min-h-[92px]"
        >
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Cloud className="w-4 h-4" />
            <span className="text-xs font-medium text-cyan-200">Weather</span>
          </div>
          <div>
            <div className="text-xl font-bold text-white tracking-tight leading-none mt-1">
              {weather.temperature}°C
            </div>
            <div className="text-[11px] text-cyan-300/80 truncate mt-1">
              {weather.condition}
            </div>
          </div>
        </button>

        {/* Today Card */}
        <button
          onClick={onTodayClick}
          className="flex flex-col justify-between p-3 rounded-2xl bg-gradient-to-b from-slate-950/70 to-blue-950/60 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_15px_rgba(0,140,255,0.2)] hover:border-cyan-300 transition-all text-left active:scale-95 cursor-pointer min-h-[92px]"
        >
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium text-cyan-200">Today</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight leading-none mt-1">
              {dayNumber}
            </div>
            <div className="text-[11px] text-cyan-300/80 font-medium mt-1">
              {dayName}, {monthName}
            </div>
          </div>
        </button>

        {/* Mood Card */}
        <button
          onClick={onMoodClick}
          className="flex flex-col justify-between p-3 rounded-2xl bg-gradient-to-b from-slate-950/70 to-blue-950/60 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_15px_rgba(0,140,255,0.2)] hover:border-pink-400/60 transition-all text-left active:scale-95 cursor-pointer min-h-[92px] group"
        >
          <div className="flex items-center gap-1.5 text-pink-400">
            <Heart className="w-4 h-4 fill-pink-500/40 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-pink-300">Mood</span>
          </div>
          <div>
            <div className="text-lg font-black text-pink-100 tracking-tight leading-tight mt-1 bg-gradient-to-r from-pink-300 to-rose-200 bg-clip-text text-transparent">
              {moodState.mood}
            </div>
            <div className="text-[11px] text-pink-200/80 font-medium mt-0.5">
              {moodState.status}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
