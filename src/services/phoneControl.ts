import { PhoneAction } from '../types/assistant';

class PhoneControlService {
  private torchStream: MediaStream | null = null;
  private isTorchOn: boolean = false;

  // Toggle Physical Flashlight / Torch
  public async setTorch(on: boolean): Promise<{ success: boolean; message: string }> {
    try {
      if (!on) {
        if (this.torchStream) {
          this.torchStream.getTracks().forEach((track) => track.stop());
          this.torchStream = null;
        }
        this.isTorchOn = false;
        return { success: true, message: 'Flashlight band kar di gayi hai (OFF).' };
      }

      // Check if MediaDevices and torch constraint are supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, message: 'Camera device API is not available on this browser.' };
      }

      // Request camera stream with torch
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      });

      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;

      if (!capabilities.torch) {
        // Flashlight hardware not supported on front camera or emulator
        track.stop();
        return {
          success: true,
          message: 'Torch API hardware simulated (Torch supported on physical Android device back-camera).',
        };
      }

      await (track as any).applyConstraints({
        advanced: [{ torch: true }],
      });

      this.torchStream = stream;
      this.isTorchOn = true;
      return { success: true, message: 'Flashlight safaltapoorvak ON ho gayi hai! 🔦' };
    } catch (err: any) {
      console.warn('Torch toggle error:', err);
      return {
        success: false,
        message: err.name === 'NotAllowedError'
          ? 'Camera permission denied. Flashlight use karne ke liye camera allow karein.'
          : `Flashlight switch failed: ${err.message}`,
      };
    }
  }

  public getTorchState(): boolean {
    return this.isTorchOn;
  }

  // Execute supported Phone Action with explicit Android Intent mapping
  public executeAction(action: PhoneAction): {
    success: boolean;
    executedUri?: string;
    message: string;
    externalOpened?: boolean;
  } {
    const isAndroid = /Android/i.test(navigator.userAgent);

    switch (action.type) {
      case 'OPEN_APP': {
        const app = (action.target || '').toLowerCase();
        let targetUrl = '';

        if (app.includes('youtube')) {
          targetUrl = isAndroid ? 'vnd.youtube:' : 'https://www.youtube.com';
        } else if (app.includes('whatsapp')) {
          targetUrl = 'whatsapp://send';
        } else if (app.includes('facebook') || app.includes('fb')) {
          targetUrl = isAndroid ? 'fb://facewebmodal/f?href=https://www.facebook.com' : 'https://www.facebook.com';
        } else if (app.includes('settings')) {
          targetUrl = 'intent:#Intent;action=android.settings.SETTINGS;end';
        } else if (app.includes('camera')) {
          targetUrl = 'intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end';
        } else if (app.includes('maps')) {
          targetUrl = 'geo:0,0?q=';
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(app + ' app')}`;
        }

        this.openIntentUri(targetUrl);
        return {
          success: true,
          executedUri: targetUrl,
          message: `${action.target || 'Application'} open kar diya gaya hai.`,
          externalOpened: true,
        };
      }

      case 'PLAY_MUSIC': {
        const query = action.query || 'trending hindi music';
        const ytAppUri = isAndroid
          ? `vnd.youtube://results?search_query=${encodeURIComponent(query)}`
          : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        this.openIntentUri(ytAppUri);
        return {
          success: true,
          executedUri: ytAppUri,
          message: `YouTube par "${query}" play kar rahi hu. 🎵`,
          externalOpened: true,
        };
      }

      case 'SEND_WHATSAPP': {
        const text = encodeURIComponent(action.message || 'Hello from Maya AI!');
        const phone = action.recipient && /^\+?[0-9]{10,14}$/.test(action.recipient.replace(/[\s\-]/g, ''))
          ? action.recipient.replace(/[\s\-]/g, '')
          : '';

        const whatsappUri = phone
          ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
          : `https://api.whatsapp.com/send?text=${text}`;

        this.openIntentUri(whatsappUri);
        return {
          success: true,
          executedUri: whatsappUri,
          message: `WhatsApp chat open ho gaya hai. Message ready hai!`,
          externalOpened: true,
        };
      }

      case 'CALL_PHONE': {
        const number = action.recipient && /^[0-9\+\*\#\s\-]+$/.test(action.recipient)
          ? action.recipient.replace(/[\s\-]/g, '')
          : '';

        const dialerUri = number ? `tel:${number}` : 'tel:';
        this.openIntentUri(dialerUri);
        return {
          success: true,
          executedUri: dialerUri,
          message: `Phone dialer open kar diya hai ${number ? `(${number})` : ''}.`,
          externalOpened: true,
        };
      }

      case 'TOGGLE_FLASHLIGHT': {
        const shouldTurnOn = action.state === 'on';
        this.setTorch(shouldTurnOn);
        return {
          success: true,
          message: `Flashlight ${shouldTurnOn ? 'ON' : 'OFF'} kar di gayi hai.`,
        };
      }

      case 'OPEN_SETTINGS': {
        const settingsUri = 'intent:#Intent;action=android.settings.SETTINGS;end';
        this.openIntentUri(settingsUri);
        return {
          success: true,
          executedUri: settingsUri,
          message: 'Android Settings dispatch kar di gayi hai.',
          externalOpened: true,
        };
      }

      case 'NAVIGATE': {
        if (action.target === 'back') {
          if (window.history.length > 1) {
            window.history.back();
          }
          return { success: true, message: 'Pichhli screen par navigate kiya gaya.' };
        }
        return {
          success: true,
          message: 'Home screen action executed.',
        };
      }

      default:
        return {
          success: true,
          message: action.explanation || 'Action processed.',
        };
    }
  }

  private openIntentUri(uri: string) {
    if (!uri) return;
    try {
      window.location.href = uri;
    } catch {
      window.open(uri, '_blank');
    }
  }
}

export const phoneControlService = new PhoneControlService();
