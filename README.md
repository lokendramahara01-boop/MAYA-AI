# MAYA AI — Your Personal Voice Assistant & Android Phone Controller 🌸✨

> **Advanced Hindi, Hinglish and English Voice Assistant with Neural Cute Female Voice, Safe Phone Action Registry, Screen Vision Assistant, and Complete Jetpack Compose Android Studio Project.**

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Kotlin](https://img.shields.io/badge/Kotlin-2.0-purple.svg)
![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-2024.10-green.svg)
![Gemini 3.8 Flash](https://img.shields.io/badge/Gemini-3.8%20Flash-orange.svg)

---

## 🌟 Key Features

### 1. 🎙️ Neural Cute Female Voice (क्यूट फीमेल वॉइस)
- **Natural, soft, sweet, caring feminine voice** powered by Gemini 3.8 Flash Lite TTS (`Kore` voice) with acoustic style modulation.
- **Natural pauses, emotional cadence**, and non-robotic flow.
- Speaks fluent **Hindi**, **Hinglish**, and **English**.
- **Instant Interruption**: Stops speaking immediately when the user speaks or taps the orb.
- **4 Voice Presets**:
  - *Sweet Cute Girl (क्यूट स्वीट)*
  - *Kawaii Anime Maya (कवाई)*
  - *Soft & Gentle (मधुर शांत)*
  - *Playful Bestie (दोस्ताना)*
- **Affectionate Addressing**: Maya lovingly addresses the user as *"Janu"* (जानू) throughout the conversation.

### 2. 📱 Android Phone Action Registry
Restricted, secure action verification system — never executes arbitrary shell commands or bypasses biometric lock screens:
- **YouTube Music**: Spoken queries dispatch `vnd.youtube://results?search_query=...` or web playback.
- **WhatsApp Messenger**: Voice message preparation and intent dispatch to `whatsapp://send?text=...`.
- **Phone Dialer**: Voice contact lookups and `tel:...` intent dispatcher with confirmation gate.
- **Hardware Flashlight / Torch**: Real physical camera torch toggle using Web MediaStream Torch API & Android CameraManager.
- **App Launcher**: Opens Facebook, Instagram, Settings, Camera, Maps, and more.
- **Navigation Controls**: Home, Back, Recent gestures via optional authorized Android Accessibility Service.

### 3. 👁️ Screen & Camera Vision Scanner
- Uses MediaStream and screen capture (MediaProjection equivalent).
- Multimodal analysis via **Gemini 3.8 Flash Vision** describing screens, text, and camera feeds warmly in Hindi/English.

### 4. 🖼️ Multi-Wallpaper Studio
- **Royal Purple Kurti Girl** (रॉयल पर्पल कुर्ती व सुनहरी धूप)
- **Cute Red Dress Girl** (पारंपरिक लाल कुर्ती व टेक बैकग्राउंड)
- **Cyber Neon Bedroom** (नीला नियॉन कमरा व बर्फीले पहाड़)
- **Custom Image Upload** from your phone gallery.

### 5. 📰 Curated Hindi News Bulletin & Daily Cards
- Live curated Hindi news with voice readout.
- Weather, Today date, and Mood tracker.
- Personal Memories notebook for learning user preferences.

---

## 🚀 Quick Start Guide

### Web App (React + Vite + Express Backend)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/maya-ai.git
   cd maya-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` (and optionally `OPENAI_API_KEY`).

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your Android phone browser or desktop.

---

## 📱 Android Studio Project (Kotlin & Jetpack Compose)

The complete native Android Studio project is located in the `android/` directory (or can be downloaded with 1-click via the in-app **"Download Android Project (.ZIP)"** button).

### Requirements:
- **Android Studio** (Koala / Ladybug or newer)
- **JDK 17**
- **Android Device** running Android 8.0 (API 26) or higher with USB Debugging enabled.

### Build Steps:
1. Open Android Studio and choose **"Open an Existing Project"**.
2. Select the `android/` directory (or extracted ZIP).
3. Allow Gradle Sync to finish.
4. Connect your Android phone via USB.
5. Click the green **Run (Play)** button to install `MAYA AI` directly on your phone!

---

## 🔒 Permissions Used & Privacy Policy

| Permission | Purpose |
|---|---|
| `RECORD_AUDIO` | Speech-to-text recognition in Hindi and English |
| `CAMERA` | Camera vision scan & flashlight torch control |
| `FLASHLIGHT` | Hardware torch toggle on device |
| `CALL_PHONE` | Direct dialing with user authorization |
| `READ_CONTACTS` | Spoken contact lookup |
| `BIND_ACCESSIBILITY_SERVICE` | Optional authorized screen navigation (Home, Back) |

*Maya AI respects user privacy. Audio and screen captures are only transmitted when explicitly initiated by the user.*

---

## 📄 License

Apache License 2.0. Built with Google AI Studio.
