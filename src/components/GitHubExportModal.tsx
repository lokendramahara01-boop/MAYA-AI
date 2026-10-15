import React, { useState } from 'react';
import { X, Download, Github, Check, Copy, Terminal, FolderArchive, Smartphone, Globe, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { downloadGitHubProjectZip } from '../services/exportFullProjectZip';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadGitHubProjectZip();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const gitCommands = `# 1. Extract the downloaded ZIP
unzip MAYA-AI-Full-Source-Code-GitHub.zip -d maya-ai
cd maya-ai

# 2. Initialize Git repository
git init
git add .
git commit -m "feat: Complete MAYA AI Personal Voice Assistant & Android Controller"
git branch -M main

# 3. Link to your GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/maya-ai.git
git push -u origin main`;

  const webCommands = `# Install dependencies and start Web App + Express Server
npm install
npm run dev

# App runs at http://localhost:3000`;

  const includedItems = [
    {
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
      title: 'Full-Stack Web App',
      desc: 'React 19, TypeScript, Tailwind CSS, Express backend, Gemini 3.8 Flash, and OpenAI routes',
      badge: 'React 19',
    },
    {
      icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
      title: 'Native Android Studio Project',
      desc: 'Complete Kotlin + Jetpack Compose app inside /android with Gradle scripts, Manifest, and drawables',
      badge: 'Kotlin 2.0',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
      title: 'Cute Voice & Phone Control Engine',
      desc: 'Web Speech API, SpeechRecognizer, Camera Torch, and Safe Action Registry with Janu addressing',
      badge: 'Voice Engine',
    },
    {
      icon: <FolderArchive className="w-4 h-4 text-amber-400" />,
      title: 'All Wallpapers & Drawables',
      desc: 'Original cyber bedroom, purple kurti, red dress, plus Android res/drawable assets',
      badge: 'Assets Included',
    },
    {
      icon: <Github className="w-4 h-4 text-purple-400" />,
      title: 'GitHub Workflows & CI/CD',
      desc: 'Automated GitHub Actions for Node.js CI testing and Android APK Gradle builds (.github/workflows/)',
      badge: 'CI / CD',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-400/50 rounded-3xl shadow-[0_0_40px_rgba(0,180,255,0.4)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-400/20 bg-gradient-to-r from-blue-950/80 via-slate-900/80 to-purple-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Export Complete MAYA AI Project
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  GitHub Ready
                </span>
              </div>
              <p className="text-xs text-cyan-300/80 mt-0.5">
                Downloadable ZIP with 100% full source code, web app, and Android Studio project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-cyan-100/90 leading-relaxed no-scrollbar">
          {/* Primary Download Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/50 via-blue-950/40 to-slate-900/60 border border-cyan-400/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>📦</span> Complete GitHub Repository ZIP
              </div>
              <p className="text-xs text-cyan-300/80 mt-1 max-w-md">
                Contains all 85+ project files: React frontend, Express server, native Android Studio project, themes, wallpapers, and GitHub CI actions.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-cyan-400/70 font-mono">
                <span>File: MAYA-AI-Full-Source-Code-GitHub.zip</span>
                <span>•</span>
                <span>Size: ~11.9 MB</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(0,229,255,0.7)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Packaging Files...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download ZIP (.ZIP)</span>
                </>
              )}
            </button>
          </div>

          {/* Included Components Grid */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-cyan-300/80 mb-2 flex items-center gap-1.5">
              <span>📂</span> Everything Included in the Download
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {includedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-col justify-between hover:border-cyan-400/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-white text-xs">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-400/30 shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-300/70 mt-1.5 leading-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Git Push Instructions */}
          <div className="rounded-2xl bg-slate-950 border border-cyan-500/20 overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-cyan-500/15 bg-slate-900/70">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
                <Terminal className="w-3.5 h-3.5" />
                <span>How to push this project to GitHub</span>
              </div>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-400/30 transition-all cursor-pointer"
              >
                {copiedSection === 'git' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono text-[11px] text-cyan-200/90 overflow-x-auto whitespace-pre leading-relaxed select-text bg-black/40">
              {gitCommands}
            </pre>
          </div>

          {/* Quick Local Run Instructions */}
          <div className="rounded-2xl bg-slate-950 border border-cyan-500/20 overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-cyan-500/15 bg-slate-900/70">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
                <Globe className="w-3.5 h-3.5" />
                <span>Running locally after extraction</span>
              </div>
              <button
                onClick={() => copyToClipboard(webCommands, 'web')}
                className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-400/30 transition-all cursor-pointer"
              >
                {copiedSection === 'web' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono text-[11px] text-cyan-200/90 overflow-x-auto whitespace-pre leading-relaxed select-text bg-black/40">
              {webCommands}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-cyan-400/20 bg-slate-900/70 flex items-center justify-between">
          <div className="text-[11px] text-cyan-300/60 flex items-center gap-1">
            <span>Ready for GitHub • Open-source Apache 2.0</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/maya-ai-complete-github-repo.zip"
              download="MAYA-AI-Full-Source-Code-GitHub.zip"
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Direct Link <ArrowRight className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
