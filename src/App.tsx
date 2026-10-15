import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { HeaderBar } from './components/HeaderBar';
import { FloatingCapsule } from './components/FloatingCapsule';
import { ActionCards } from './components/ActionCards';
import { CommandInput } from './components/CommandInput';
import { BottomNav } from './components/BottomNav';
import { ChatOverlay } from './components/ChatOverlay';
import { PhoneControlModal } from './components/PhoneControlModal';
import { ScanModal } from './components/ScanModal';
import { NewsModal } from './components/NewsModal';
import { MemoriesModal } from './components/MemoriesModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import { CuteVoiceModal } from './components/CuteVoiceModal';
import { BackgroundModal } from './components/BackgroundModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { FeatureDetailModal } from './components/FeatureDetailModal';
import { GitHubExportModal } from './components/GitHubExportModal';

import { speechService, CUTE_VOICE_PRESETS, CuteVoicePreset } from './services/speech';
import { phoneControlService } from './services/phoneControl';
import { sendChatMessage } from './services/api';
import { ChatMessage, PhoneAction, WeatherData, AssistantMemory } from './types/assistant';

export default function App() {
  // Navigation & Modal states
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'scan' | 'memories' | 'chat'>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isCuteVoiceModalOpen, setIsCuteVoiceModalOpen] = useState(false);
  const [isGitHubExportOpen, setIsGitHubExportOpen] = useState(false);
  const [activeFeatureModal, setActiveFeatureModal] = useState<'study' | 'journal' | 'weather' | 'mood' | 'always' | null>(null);

  // Background and Cute Voice
  const [currentBackground, setCurrentBackground] = useState<string>('/assets/maya_red_dress.jpg');
  const [cuteVoicePreset, setCuteVoicePreset] = useState<CuteVoicePreset>(CUTE_VOICE_PRESETS[0]);
  const [energyCount, setEnergyCount] = useState(3);
  const [isLicenseActive, setIsLicenseActive] = useState(false);

  // Assistant State
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'hindi' | 'hinglish' | 'english'>('hinglish');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>('gemini');
  const [torchActive, setTorchActive] = useState(false);

  // Phone Action Registry Verification
  const [pendingAction, setPendingAction] = useState<PhoneAction | null>(null);
  const [isPhoneActionModalOpen, setIsPhoneActionModalOpen] = useState(false);

  // Data
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'जी, मैं सुन रही हूँ! बताइए, आज आपको क्या करना है? चिंता मत कीजिए, आपकी क्यूट माया आपकी मदद के लिए हमेशा यहाँ है। 💕',
      timestamp: 'Just now',
      language: 'hinglish',
    },
  ]);

  const [weather] = useState<WeatherData>({
    city: 'Delhi NCR',
    temperature: 28,
    condition: 'Pleasant & Clear',
    humidity: 48,
    windSpeed: 12,
    forecast: 'Mild evening breeze with clear skies throughout the night',
  });

  const [moodState] = useState({
    mood: 'Warm',
    status: 'All good',
  });

  const [memories, setMemories] = useState<AssistantMemory[]>([
    {
      id: 'mem-1',
      category: 'preference',
      content: 'Likes listening to Arijit Singh on YouTube',
      date: 'Oct 14',
    },
    {
      id: 'mem-2',
      category: 'fact',
      content: 'Prefers Hindi and Hinglish voice responses',
      date: 'Oct 14',
    },
  ]);

  // Voice language mapping for Web Speech API
  const getSpeechLangCode = () => {
    if (language === 'hindi') return 'hi-IN';
    if (language === 'hinglish') return 'hi-IN';
    return 'en-IN';
  };

  // Process user message (via voice or typing)
  const handleProcessMessage = async (text: string) => {
    if (!text.trim()) return;

    // Interrupt any ongoing speech immediately
    speechService.stopSpeaking();
    setIsSpeaking(false);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(text.trim(), historyPayload, aiProvider, language);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action,
        language,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak Maya's response
      speechService.speak(
        response.reply,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );

      // Check for project export intent in spoken or typed text
      const lowerText = text.toLowerCase();
      if (
        lowerText.includes('export') ||
        lowerText.includes('github') ||
        lowerText.includes('source code') ||
        lowerText.includes('download zip') ||
        lowerText.includes('project zip') ||
        lowerText.includes('project download')
      ) {
        setIsGitHubExportOpen(true);
      }

      // Handle Phone Action Intent
      if (response.action && response.action.type !== 'CHAT') {
        if (response.action.requiresConfirmation) {
          setPendingAction(response.action);
          setIsPhoneActionModalOpen(true);
        } else {
          // Execute automatically for safe actions like Play Music or Flashlight
          executePhoneAction(response.action);
        }
      }
    } catch (err: any) {
      console.error('Chat processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute Phone Action
  const executePhoneAction = (action: PhoneAction) => {
    const result = phoneControlService.executeAction(action);
    setTorchActive(phoneControlService.getTorchState());

    if (action.type === 'PLAY_MUSIC' || action.type === 'OPEN_APP') {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }

    setPendingAction(null);
    setIsPhoneActionModalOpen(false);
  };

  // Toggle Voice Listening
  const handleToggleVoice = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    }

    const langCode = getSpeechLangCode();
    speechService.startListening(
      langCode,
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          setIsListening(false);
          handleProcessMessage(transcript);
        }
      },
      (error) => {
        console.warn('Speech recognition warning:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  // Central Orb action
  const handleOrbClick = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    handleToggleVoice();
  };

  // Flashlight toggle
  const handleToggleFlashlight = async () => {
    const nextState = !torchActive;
    await phoneControlService.setTorch(nextState);
    setTorchActive(phoneControlService.getTorchState());
  };

  // Navigation tab handler
  const handleNavTab = (tab: 'home' | 'scan' | 'memories' | 'chat') => {
    setActiveNavTab(tab);
    if (tab === 'chat') {
      setIsChatOpen(true);
    } else if (tab === 'scan') {
      setIsScanOpen(true);
    } else if (tab === 'memories') {
      setIsMemoriesOpen(true);
    }
  };

  // Floating capsule action handler
  const handleCapsuleAction = (actionId: string) => {
    switch (actionId) {
      case 'voice_chat':
        handleToggleVoice();
        break;
      case 'text_chat':
        setIsChatOpen(true);
        break;
      case 'image_video':
        setIsScanOpen(true);
        break;
      case 'study_learn':
        setActiveFeatureModal('study');
        break;
      case 'create_assist':
        setIsAndroidCodeOpen(true);
        break;
      case 'always_with_you':
        setActiveFeatureModal('always');
        break;
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black font-sans antialiased text-white select-none">
      {/* 
      {/* Main Background Image with dynamic currentBackground */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={currentBackground}
          alt="MAYA AI Assistant"
          className="w-full h-full object-cover object-top sm:object-center transform scale-[1.01] transition-all duration-500"
        />

        {/* Ambient Dark Cyan Vignettes for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-transparent to-slate-950/90 pointer-events-none" />
      </div>

      {/* Main UI Canvas Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between max-w-lg mx-auto">
        {/* Top Header Bar */}
        <HeaderBar
          onOpenMenu={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNewsOpen(true)}
          onOpenProfile={() => setIsSettingsOpen(true)}
          onOpenCuteVoice={() => setIsCuteVoiceModalOpen(true)}
          onOpenBackgroundModal={() => setIsBackgroundModalOpen(true)}
          onOpenGitHubExport={() => setIsGitHubExportOpen(true)}
          isListening={isListening}
          isSpeaking={isSpeaking}
          unreadCount={1}
          currentBg={currentBackground}
        />

        {/* Top License Bar from Screenshot */}
        <div className="px-4 py-1 select-none">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-cyan-400">🔒</span>
              <div className="truncate">
                <div className="font-semibold text-white text-[11px]">
                  Free mode • 0:23 min left today
                </div>
                <div className="text-[10px] text-cyan-300/70 truncate">
                  Activate a license for all tools and unlimited talk
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsLicenseActive(true);
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-bold text-[11px] border border-cyan-400/40 active:scale-95 transition-all cursor-pointer"
            >
              {isLicenseActive ? 'Active ✨' : 'Activate'}
            </button>
          </div>
        </div>

        {/* Greeting and Energy Badge from Screenshot */}
        <div className="px-5 pt-1 pb-2 flex items-start justify-between select-none">
          <div>
            <div className="text-sm font-medium text-pink-300">Good morning,</div>
            <div className="text-2xl font-black text-white tracking-wide leading-tight flex items-center gap-1.5">
              <span>Janu</span>
              <span className="text-pink-400 text-lg">💕</span>
            </div>
            <div className="text-xs text-cyan-400/90 font-medium flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-cyan-400 animate-ping' : isSpeaking ? 'bg-pink-400 animate-pulse' : 'bg-emerald-400'}`} />
              {isListening ? 'Listening (Janu, बोलिए)...' : isSpeaking ? 'Maya is speaking...' : `Maya 💕 • ${cuteVoicePreset.name}`}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/75 border border-amber-400/30 text-xs shadow-[0_0_12px_rgba(251,191,36,0.2)]">
              <span className="text-amber-400">⚡</span>
              <span className="font-bold text-white">{energyCount}</span>
              <span className="text-[10px] text-amber-200/80">Energy</span>
            </div>

            {/* Quick Background Change Trigger */}
            <button
              onClick={() => setIsBackgroundModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-blue-950/70 border border-cyan-400/40 text-[10px] text-cyan-300 font-semibold hover:bg-cyan-500/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>🖼️</span> Change BG
            </button>
          </div>
        </div>

        {/* Floating Capsule on Upper Right */}
        <FloatingCapsule onSelectAction={handleCapsuleAction} />

        {/* Middle Interactive Zone */}
        <div className="flex-1 flex flex-col justify-end pb-3 space-y-3">
          {/* Action Cards (Music, Study, Journal + Weather, Today, Mood) */}
          <ActionCards
            onMusicClick={() => {
              executePhoneAction({
                type: 'PLAY_MUSIC',
                target: 'youtube',
                query: 'Trending Hindi Music',
                explanation: 'Playing music on YouTube',
              });
            }}
            onStudyClick={() => setActiveFeatureModal('study')}
            onJournalClick={() => setActiveFeatureModal('journal')}
            onWeatherClick={() => setActiveFeatureModal('weather')}
            onTodayClick={() => setIsNewsOpen(true)}
            onMoodClick={() => setActiveFeatureModal('mood')}
            weather={weather}
            moodState={moodState}
          />

          {/* Main Command Input Box */}
          <CommandInput
            value={inputText}
            onChange={setInputText}
            onSubmit={() => handleProcessMessage(inputText)}
            onAttachFile={(file) => {
              const reader = new FileReader();
              reader.onload = () => {
                setIsScanOpen(true);
              };
              reader.readAsDataURL(file);
            }}
            isProcessing={isProcessing}
            isListening={isListening}
          />
        </div>

        {/* Bottom Navigation with Animated Glowing Central Orb */}
        <BottomNav
          activeTab={activeNavTab}
          onTabChange={handleNavTab}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isProcessing={isProcessing}
          onOrbClick={handleOrbClick}
        />
      </div>

      {/* MODALS & OVERLAYS */}

      {/* Full Chat & Transcript Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setActiveNavTab('home');
        }}
        messages={messages}
        onSpeakMessage={(text) =>
          speechService.speak(
            text,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false),
            cuteVoicePreset.pitch,
            cuteVoicePreset.rate
          )
        }
        onExecuteAction={(act) => executePhoneAction(act)}
        onQuickCommand={(cmd) => {
          setInputText(cmd);
          handleProcessMessage(cmd);
        }}
        isSpeaking={isSpeaking}
      />

      {/* Android Phone Control Center & Intent Verifier */}
      <PhoneControlModal
        isOpen={isPhoneActionModalOpen}
        onClose={() => setIsPhoneActionModalOpen(false)}
        pendingAction={pendingAction}
        onConfirmAction={(act) => executePhoneAction(act)}
        onCancelAction={() => {
          setPendingAction(null);
          setIsPhoneActionModalOpen(false);
        }}
        torchState={torchActive}
        onToggleTorch={handleToggleFlashlight}
      />

      {/* Camera & Screen Vision Scanner (Gemini Multimodal) */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => {
          setIsScanOpen(false);
          setActiveNavTab('home');
        }}
        onSpeakText={(text) =>
          speechService.speak(
            text,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false),
            cuteVoicePreset.pitch,
            cuteVoicePreset.rate
          )
        }
      />

      {/* Curated Hindi News Bulletin */}
      <NewsModal
        isOpen={isNewsOpen}
        onClose={() => setIsNewsOpen(false)}
        onSpeakText={(text) =>
          speechService.speak(
            text,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false),
            cuteVoicePreset.pitch,
            cuteVoicePreset.rate
          )
        }
      />

      {/* Memories & Personal Notes Notebook */}
      <MemoriesModal
        isOpen={isMemoriesOpen}
        onClose={() => {
          setIsMemoriesOpen(false);
          setActiveNavTab('home');
        }}
        memories={memories}
        onAddMemory={(cat, content) => {
          const newMem: AssistantMemory = {
            id: `mem-${Date.now()}`,
            category: cat,
            content,
            date: 'Today',
          };
          setMemories([newMem, ...memories]);
          confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
        }}
        onDeleteMemory={(id) => {
          setMemories(memories.filter((m) => m.id !== id));
        }}
      />

      {/* Complete Android Kotlin & Compose Source Code + 1-Click ZIP Downloader */}
      <AndroidCodeModal
        isOpen={isAndroidCodeOpen}
        onClose={() => setIsAndroidCodeOpen(false)}
        onOpenGitHubExport={() => setIsGitHubExportOpen(true)}
      />

      {/* Cute Girl Voice Studio Modal */}
      <CuteVoiceModal
        isOpen={isCuteVoiceModalOpen}
        onClose={() => setIsCuteVoiceModalOpen(false)}
        selectedPresetId={cuteVoicePreset.id}
        onSelectPreset={(preset) => {
          setCuteVoicePreset(preset);
          speechService.setVoicePreset(preset.id);
        }}
      />

      {/* Background Selector & Upload Modal */}
      <BackgroundModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        currentBg={currentBackground}
        onSelectBg={(bgUrl) => {
          setCurrentBackground(bgUrl);
          confetti({ particleCount: 40, spread: 50 });
        }}
      />

      {/* GitHub Repository Full Source Export Modal */}
      <GitHubExportModal
        isOpen={isGitHubExportOpen}
        onClose={() => setIsGitHubExportOpen(false)}
      />

      {/* Settings & Permissions Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        provider={aiProvider}
        onProviderChange={setAiProvider}
        onOpenAndroidCode={() => {
          setIsSettingsOpen(false);
          setIsAndroidCodeOpen(true);
        }}
        onOpenPhoneControls={() => {
          setIsSettingsOpen(false);
          setIsPhoneActionModalOpen(true);
        }}
        onOpenCuteVoice={() => {
          setIsSettingsOpen(false);
          setIsCuteVoiceModalOpen(true);
        }}
        onOpenBackgroundModal={() => {
          setIsSettingsOpen(false);
          setIsBackgroundModalOpen(true);
        }}
        onOpenGitHubExport={() => {
          setIsSettingsOpen(false);
          setIsGitHubExportOpen(true);
        }}
      />

      {/* Feature Details: Study, Journal, Weather, Mood, Always With You */}
      <FeatureDetailModal
        type={activeFeatureModal}
        onClose={() => setActiveFeatureModal(null)}
        weather={weather}
        onSpeakText={(text) =>
          speechService.speak(
            text,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false),
            cuteVoicePreset.pitch,
            cuteVoicePreset.rate
          )
        }
      />
    </main>
  );
}
