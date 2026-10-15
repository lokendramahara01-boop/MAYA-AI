import React, { useState } from 'react';
import { X, Download, FileCode, Check, Loader2, BookOpen, Copy, Github } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAndroidProjectZip } from '../services/androidProjectZip';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGitHubExport?: () => void;
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose, onOpenGitHubExport }) => {
  const [selectedFile, setSelectedFile] = useState<string>('MainActivity.kt');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files: Record<string, { lang: string; path: string; code: string }> = {
    'MainActivity.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/maya/ai/assistant/MainActivity.kt',
      code: `package com.maya.ai.assistant

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.maya.ai.assistant.service.MayaActionRegistry
import com.maya.ai.assistant.service.MayaVoiceManager

class MainActivity : ComponentActivity() {

    private lateinit var voiceManager: MayaVoiceManager
    private lateinit var actionRegistry: MayaActionRegistry

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val recordAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        if (recordAudioGranted) {
            voiceManager.initSpeechRecognizer()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        actionRegistry = MayaActionRegistry(this)
        voiceManager = MayaVoiceManager(this) { spokenText ->
            actionRegistry.handleVoiceCommand(spokenText)
        }

        checkAndRequestPermissions()

        setContent {
            MayaTheme {
                MayaHomeScreen(
                    onMicClick = { voiceManager.toggleListening() },
                    isListening = voiceManager.isListeningState,
                    assistantStatus = voiceManager.statusMessage,
                    onActionClick = { actionType ->
                        actionRegistry.handleQuickAction(actionType)
                    }
                )
            }
        }
    }

    private fun checkAndRequestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CALL_PHONE,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.CAMERA
        )
        val missing = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isNotEmpty()) {
            requestPermissionLauncher.launch(missing.toTypedArray())
        } else {
            voiceManager.initSpeechRecognizer()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        voiceManager.destroy()
    }
}`,
    },
    'MayaActionRegistry.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/maya/ai/assistant/service/MayaActionRegistry.kt',
      code: `package com.maya.ai.assistant.service

import android.content.Context
import android.content.Intent
import android.hardware.camera2.CameraManager
import android.net.Uri
import android.widget.Toast

class MayaActionRegistry(private val context: Context) {

    private val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private var isTorchOn = false

    fun handleVoiceCommand(command: String) {
        val lower = command.lowercase()

        when {
            lower.contains("youtube") || lower.contains("gaana") || lower.contains("song") -> {
                val query = lower.replace("hey maya", "")
                    .replace("youtube par", "")
                    .replace("gaana chalao", "")
                    .replace("kholo", "")
                    .trim()
                playMusicOnYouTube(query)
            }
            lower.contains("whatsapp") -> {
                openWhatsApp()
            }
            lower.contains("flashlight") || lower.contains("torch") -> {
                val turnOn = !lower.contains("band") && !lower.contains("off")
                toggleTorch(turnOn)
            }
            lower.contains("setting") -> {
                openSettings()
            }
            lower.contains("home") -> {
                MayaAccessibilityService.instance?.performHome() 
                    ?: Toast.makeText(context, "Accessibility permission required", Toast.LENGTH_SHORT).show()
            }
            lower.contains("back") || lower.contains("pichhli") -> {
                MayaAccessibilityService.instance?.performBack() 
                    ?: Toast.makeText(context, "Accessibility permission required", Toast.LENGTH_SHORT).show()
            }
            else -> {
                Toast.makeText(context, "Maya: $command", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun playMusicOnYouTube(query: String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("vnd.youtube://results?search_query=$query")).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/results?search_query=$query")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(webIntent)
        }
    }

    fun openWhatsApp() {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("whatsapp://send")).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "WhatsApp is not installed", Toast.LENGTH_SHORT).show()
        }
    }

    fun toggleTorch(turnOn: Boolean) {
        try {
            val cameraId = cameraManager.cameraIdList[0]
            cameraManager.setTorchMode(cameraId, turnOn)
            isTorchOn = turnOn
            Toast.makeText(context, if (turnOn) "Flashlight ON 🔦" else "Flashlight OFF", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(context, "Flashlight error: \${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    fun openSettings() {
        val intent = Intent(android.provider.Settings.ACTION_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }
}`,
    },
    'AndroidManifest.xml': {
      lang: 'xml',
      path: 'app/src/main/AndroidManifest.xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <queries>
        <package android:name="com.google.android.youtube" />
        <package android:name="com.whatsapp" />
        <package android:name="com.facebook.katana" />
        <package android:name="com.instagram.android" />
        <package android:name="com.google.android.apps.maps" />
    </queries>

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:theme="@style/Theme.MayaAI"
        tools:targetApi="35">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".service.MayaAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>
    </application>
</manifest>`,
    },
    'SETUP_HINDI.md': {
      lang: 'markdown',
      path: 'SETUP_HINDI.md',
      code: `# MAYA AI — Android Studio Setup & Build Guide (Hindi)

MAYA AI एक आधुनिक, सुरक्षित और शक्तिशाली Android Voice Assistant है जिसे Jetpack Compose और Kotlin में बनाया गया है।

## आवश्यक चीजें (Requirements)
1. **Android Studio** (Koala / Ladybug या नवीनतम संस्करण)
2. **JDK 17**
3. **Android Phone** (Android 8.0 Oreo या अधिक) USB Debugging ऑन के साथ

## कदम 1: प्रोजेक्ट खोलें
1. नीचे दिए गए **"Download Android Studio Project (.ZIP)"** बटन पर क्लिक करें।
2. डाउनलोड की गई ZIP फाइल को अपने कंप्यूटर पर Extract करें।
3. Android Studio खोलें और **"Open"** पर क्लिक करें।
4. Extract किए गए \`MayaAI\` फोल्डर को चुनें।
5. Gradle Sync पूरा होने दें।

## कदम 2: Background Image Asset
- असली बैकग्राउंड इमेज \`app/src/main/res/drawable/maya_background.jpg\` में शामिल है।
- यह होम स्क्रीन पर बिना किसी स्ट्रेच के 100% फिट बैठती है।

## कदम 3: फोन में इनस्टॉल और टेस्ट करें
1. अपने Android फ़ोन की **Settings -> About Phone -> Build Number** पर 7 बार टैप करें।
2. **Developer Options -> USB Debugging** को ON करें।
3. फ़ोन को USB केबल से PC से कनेक्ट करें।
4. Android Studio में ऊपर दिए गए हरे **"Run" (Play) बटन** पर क्लिक करें।
5. MAYA AI आपके फ़ोन पर सीधे इंस्टॉल और लॉन्च हो जाएगी!`,
    },
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MayaAI-Android-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = () => {
    const code = files[selectedFile]?.code || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-cyan-400/50 rounded-3xl shadow-[0_0_40px_rgba(0,180,255,0.35)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-400/20 bg-blue-950/50">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">MAYA AI — Android Kotlin & Compose Source</h2>
              <p className="text-[10px] text-cyan-300/80">Production-ready buildable Android project</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenGitHubExport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGitHubExport();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-400/40 text-purple-200 hover:text-white hover:bg-purple-900/60 font-semibold text-xs transition-all cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              >
                <Github className="w-3.5 h-3.5 text-purple-300" />
                <span>Export GitHub ZIP</span>
              </button>
            )}
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating ZIP...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download Android (.ZIP)
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-cyan-500/15 bg-slate-900/80 overflow-x-auto no-scrollbar">
          {Object.keys(files).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setSelectedFile(fileName)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedFile === fileName
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'text-cyan-300/60 hover:text-cyan-200 hover:bg-cyan-500/10'
              }`}
            >
              {fileName.endsWith('.md') ? <BookOpen className="w-3 h-3" /> : <FileCode className="w-3 h-3" />}
              {fileName}
            </button>
          ))}
        </div>

        {/* Code Content View */}
        <div className="relative flex-1 p-4 bg-slate-950 overflow-y-auto font-mono text-xs text-cyan-100/90 leading-relaxed">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/10 text-[11px] text-cyan-400/60">
            <span>{files[selectedFile]?.path}</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/20 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap select-text">{files[selectedFile]?.code}</pre>
        </div>
      </div>
    </div>
  );
};
