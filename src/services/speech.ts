// Web Speech API interfaces for Speech Recognition & Text-To-Speech with Cute Girl Voice Tuning

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface CuteVoicePreset {
  id: string;
  name: string;
  hindiName: string;
  pitch: number;
  rate: number;
  sampleGreeting: string;
  description: string;
}

export const CUTE_VOICE_PRESETS: CuteVoicePreset[] = [
  {
    id: 'cute_sweet',
    name: 'Sweet Cute Girl (क्यूट स्वीट)',
    hindiName: 'प्यारी और मीठी आवाज़',
    pitch: 1.35,
    rate: 1.02,
    sampleGreeting: 'जी, मैं सुन रही हूँ। बताइए, आपको क्या करना है? 💕',
    description: 'Youthful, sweet, soft, feminine and loving tone',
  },
  {
    id: 'kawaii_anime',
    name: 'Kawaii Anime Maya (कवाई)',
    hindiName: 'चुलबुली एनिमे स्टाइल',
    pitch: 1.48,
    rate: 1.08,
    sampleGreeting: 'चिंता मत कीजिए, मैं आपकी मदद के लिए हमेशा यहाँ हूँ! ✨',
    description: 'Ultra cute, high-pitch anime girl personality',
  },
  {
    id: 'soft_gentle',
    name: 'Soft & Gentle (मधुर शांत)',
    hindiName: 'शांत और कोमल आवाज़',
    pitch: 1.22,
    rate: 0.96,
    sampleGreeting: 'ठीक है, मैं अभी आपकी मदद करती हूँ। आप बहुत अच्छे हैं।',
    description: 'Warm, soft-spoken, caring companion voice',
  },
  {
    id: 'cheerful_bestie',
    name: 'Playful Bestie (दोस्ताना)',
    hindiName: 'मस्त और खुशमिजाज दोस्त',
    pitch: 1.28,
    rate: 1.05,
    sampleGreeting: 'आपको कौन-सा गाना सुनना है? मैं अभी YouTube पर चलाती हूँ! 🎵',
    description: 'Vibrant, playful Indian girl bestie voice',
  },
];

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentPreset: CuteVoicePreset = CUTE_VOICE_PRESETS[0];

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRecognitionConstructor =
        win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.initVoice();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.initVoice();
        }
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();

    // Prioritize natural cute female voices in Hindi and Indian/Global English
    const priorityVoices = [
      voices.find((v) => v.name.toLowerCase().includes('swara')), // Microsoft Swara Natural (Hindi)
      voices.find((v) => v.name.toLowerCase().includes('neerja')),
      voices.find((v) => v.lang.includes('hi') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google'))),
      voices.find((v) => v.name.toLowerCase().includes('google हिन्दी') || v.lang === 'hi-IN'),
      voices.find((v) => v.name.toLowerCase().includes('samantha')),
      voices.find((v) => v.name.toLowerCase().includes('victoria')),
      voices.find((v) => v.name.toLowerCase().includes('zira')),
      voices.find((v) => v.name.toLowerCase().includes('female')),
      voices.find((v) => v.lang.includes('IN')),
      voices[0],
    ];

    this.selectedVoice = priorityVoices.find(Boolean) || null;
  }

  public setVoicePreset(presetId: string) {
    const found = CUTE_VOICE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      this.currentPreset = found;
    }
  }

  public getCurrentPreset(): CuteVoicePreset {
    return this.currentPreset;
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public isTtsSupported(): boolean {
    return !!this.synth;
  }

  public startListening(
    lang: 'hi-IN' | 'en-IN' | 'en-US' = 'hi-IN',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech Recognition is not supported in this browser. You can type your command below!');
      return;
    }

    try {
      this.recognition.lang = lang;
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          onResult(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        onError(
          event.error === 'not-allowed'
            ? 'Microphone permission denied. Please allow microphone in browser.'
            : event.error === 'no-speech'
            ? 'Koi aawaz nahi suni gayi. Dubara koshish karein.'
            : `Speech error: ${event.error}`
        );
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Failed to start speech recognition');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.isListening = false;
    }
  }

  private currentAudio: HTMLAudioElement | null = null;
  private onEndCallback: (() => void) | null = null;

  public async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    customPitch?: number,
    customRate?: number,
    preferNeuralTts: boolean = true
  ) {
    // 1. Instant Interruption: Stop any previous playback immediately
    this.stopSpeaking();

    const cleanText = text
      .replace(/[\*\_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    this.onEndCallback = onEnd || null;

    // 2. Try High-Quality Neural Cute Female Voice (Gemini 3.8 Flash TTS with Kore)
    if (preferNeuralTts) {
      try {
        const { generateNeuralTTS } = await import('./api');
        const neuralRes = await generateNeuralTTS(cleanText, 'Kore');

        if (neuralRes.audioBase64) {
          const audio = new Audio(`data:${neuralRes.mimeType || 'audio/wav'};base64,${neuralRes.audioBase64}`);
          this.currentAudio = audio;

          audio.onplay = () => {
            if (onStart) onStart();
          };

          audio.onended = () => {
            this.currentAudio = null;
            if (this.onEndCallback) {
              this.onEndCallback();
              this.onEndCallback = null;
            }
          };

          audio.onerror = (e) => {
            console.warn('Neural audio playback error, falling back to Web Speech:', e);
            this.currentAudio = null;
            this.speakWithWebSpeech(cleanText, onStart, onEnd, customPitch, customRate);
          };

          await audio.play();
          return;
        }
      } catch (neuralErr) {
        console.warn('Neural TTS request failed, using Web Speech fallback:', neuralErr);
      }
    }

    // 3. Fallback to Web Speech Synthesis tuned with Cute Girl Voice parameters
    this.speakWithWebSpeech(cleanText, onStart, onEnd, customPitch, customRate);
  }

  private speakWithWebSpeech(
    cleanText: string,
    onStart?: () => void,
    onEnd?: () => void,
    customPitch?: number,
    customRate?: number
  ) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Apply cute girl pitch and rate
      utterance.pitch = customPitch ?? this.currentPreset.pitch;
      utterance.rate = customRate ?? this.currentPreset.rate;

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (this.onEndCallback) {
          this.onEndCallback();
          this.onEndCallback = null;
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        if (this.onEndCallback) {
          this.onEndCallback();
          this.onEndCallback = null;
        }
      };

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('speakWithWebSpeech error:', e);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    // Stop neural audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.warn('Error pausing current audio:', e);
      }
      this.currentAudio = null;
    }

    // Stop Web Speech Synthesis
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Error cancelling synth:', e);
      }
    }

    if (this.onEndCallback) {
      this.onEndCallback();
      this.onEndCallback = null;
    }
  }
}

export const speechService = new SpeechService();
