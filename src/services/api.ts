import { PhoneAction, NewsArticle } from '../types/assistant';

export interface ChatResponse {
  reply: string;
  action: PhoneAction;
  error?: string;
}

export async function sendChatMessage(
  message: string,
  history: { role: string; content: string }[],
  provider: 'gemini' | 'openai' = 'gemini',
  preferredLanguage: 'hindi' | 'hinglish' | 'english' = 'hinglish'
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        provider,
        preferredLanguage,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error('sendChatMessage error:', error);
    // Intelligent local fallback if server cannot be reached
    return {
      reply: 'Maine aapki baat sun li hai. Kya aap ise dubara bolna chahenge?',
      action: {
        type: 'CHAT',
        explanation: 'Local fallback processing',
        requiresConfirmation: false,
      },
      error: error.message,
    };
  }
}

export async function analyzeScreenOrPhoto(
  imageBase64: string,
  prompt?: string
): Promise<{ description: string; error?: string }> {
  try {
    const res = await fetch('/api/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        prompt,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Vision analysis failed');
    }

    return await res.json();
  } catch (error: any) {
    return {
      description: 'Tasveer scan karne me thodi samasya aayi. Kripya image dubara bhejein.',
      error: error.message,
    };
  }
}

export async function fetchCuratedNews(category: string = 'all'): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`/api/news?category=${category}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}

export async function generateNeuralTTS(
  text: string,
  voice: string = 'Kore'
): Promise<{ audioBase64?: string; mimeType?: string; error?: string }> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.error || 'TTS generation error' };
    }
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

