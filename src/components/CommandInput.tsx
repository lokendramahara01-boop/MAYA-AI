import React, { useRef } from 'react';
import { Paperclip, Send, Loader2 } from 'lucide-react';

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onAttachFile: (file: File) => void;
  isProcessing: boolean;
  isListening: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  value,
  onChange,
  onSubmit,
  onAttachFile,
  isProcessing,
  isListening,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachFile(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full px-3 z-20 select-none">
      <div className="relative flex items-center w-full px-3 py-2.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-cyan-400/60 shadow-[0_0_20px_rgba(0,180,255,0.3)] focus-within:border-cyan-300 focus-within:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Paperclip Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach Screen or Photo"
          title="Upload Screen or Photo for Maya Vision Analysis"
          className="p-1.5 rounded-full text-cyan-300/80 hover:text-cyan-200 hover:bg-cyan-500/20 transition-all active:scale-95 cursor-pointer"
        >
          <Paperclip className="w-5 h-5 -rotate-45" />
        </button>

        {/* Input text field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? 'Listening... बोलिए जानू (Hindi/English) 💕'
              : 'Ask Maya anything, Janu... (कुछ भी पूछिए जानू 💕)'
          }
          className="flex-1 bg-transparent px-3 text-sm text-white placeholder-cyan-200/50 focus:outline-none tracking-wide"
        />

        {/* Send Button */}
        <button
          onClick={onSubmit}
          disabled={isProcessing || (!value.trim() && !isListening)}
          aria-label="Send Command"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-90 disabled:opacity-40 disabled:scale-100 disabled:shadow-none transition-all cursor-pointer"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4 translate-x-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
