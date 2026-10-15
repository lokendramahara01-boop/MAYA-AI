import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, Monitor, Sparkles, Loader2, StopCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeScreenOrPhoto } from '../services/api';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpeakText: (text: string) => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({
  isOpen,
  onClose,
  onSpeakText,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<'camera' | 'screen'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startFeed(mode);
    } else {
      stopFeed();
      setAnalysisResult(null);
      setErrorMessage(null);
    }
    return () => {
      stopFeed();
    };
  }, [isOpen, mode]);

  const startFeed = async (selectedMode: 'camera' | 'screen') => {
    stopFeed();
    setErrorMessage(null);

    try {
      let mediaStream: MediaStream;
      if (selectedMode === 'camera') {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } else {
        // MediaProjection equivalent in Web: getDisplayMedia
        if (!navigator.mediaDevices.getDisplayMedia) {
          throw new Error('Screen capture is not supported on this browser version.');
        }
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'browser' },
        });
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Media capture error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Capture consent denied by user.'
          : err.message || 'Could not start visual capture.'
      );
    }
  };

  const stopFeed = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg', 0.85);

      const prompt = mode === 'camera'
        ? 'Aap Maya AI hain. Is camera snapshot ko dhyan se dekhiye. Isme jo bhi vastu, vyakti, text ya mahatvapoorna cheez dikh rahi hai, use Hindi/Hinglish me dostana andaaz me samjhaiye.'
        : 'Aap Maya AI hain. Is phone/screen capture ko dhyan se padhiye aur analyze kijiye. Isme kaunsi app ya text khula hai, aur user ki kya madad ki ja sakti hai, Hindi me bataiye.';

      const result = await analyzeScreenOrPhoto(base64Data, prompt);
      setAnalysisResult(result.description);
      onSpeakText(result.description);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-950 border border-cyan-400/40 rounded-3xl shadow-[0_0_35px_rgba(0,180,255,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-400/20 bg-blue-950/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">MAYA Vision & Screen Assistant</h2>
              <p className="text-[10px] text-cyan-300/80">Authorized visual scanner powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-5 py-2.5 flex items-center justify-center gap-2 border-b border-cyan-400/10 bg-slate-900/60">
          <button
            onClick={() => setMode('camera')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-cyan-300/60 hover:text-cyan-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Camera View
          </button>

          <button
            onClick={() => setMode('screen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === 'screen'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'text-cyan-300/60 hover:text-cyan-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Screen Capture (MediaProjection)
          </button>
        </div>

        {/* Video Preview Box */}
        <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-cyan-500/30 flex items-center justify-center">
            {/* Live Indicator */}
            {stream && (
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-white text-[10px] font-bold shadow-[0_0_10px_red]">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                REC LIVE
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {!stream && !errorMessage && (
              <div className="text-center text-cyan-300/70 p-4">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                <span className="text-xs">Requesting camera / screen permission...</span>
              </div>
            )}

            {errorMessage && (
              <div className="text-center text-rose-300 p-4 max-w-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
                <span className="text-xs">{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Action Button: Capture & Analyze */}
          <div className="flex items-center gap-2">
            <button
              onClick={captureAndAnalyze}
              disabled={!stream || isScanning}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Maya is analyzing screen...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Scan Frame with Maya AI
                </>
              )}
            </button>

            {stream && (
              <button
                onClick={stopFeed}
                title="Stop Capture"
                className="p-2.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Analysis Output Result */}
          {analysisResult && (
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-cyan-400/40 text-xs text-cyan-100 leading-relaxed shadow-[0_0_15px_rgba(0,180,255,0.15)] animate-fade-in">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Maya AI Vision Analysis (Hindi):
              </div>
              <p className="whitespace-pre-wrap">{analysisResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
