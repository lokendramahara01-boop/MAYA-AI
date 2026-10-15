export type ActionType =
  | 'OPEN_APP'
  | 'PLAY_MUSIC'
  | 'SEND_WHATSAPP'
  | 'CALL_PHONE'
  | 'GET_NEWS'
  | 'TOGGLE_FLASHLIGHT'
  | 'OPEN_SETTINGS'
  | 'NAVIGATE'
  | 'DEVICE_STATUS'
  | 'CHAT';

export interface PhoneAction {
  type: ActionType;
  target?: string | null;
  query?: string | null;
  recipient?: string | null;
  message?: string | null;
  state?: 'on' | 'off' | null;
  requiresConfirmation?: boolean;
  explanation?: string;
  directUrl?: string;
  androidIntent?: string;
  status?: 'pending' | 'confirmed' | 'executed' | 'cancelled' | 'denied';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: PhoneAction | null;
  language?: 'hindi' | 'hinglish' | 'english';
  audioPlaying?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  time: string;
  link: string;
}

export interface AssistantMemory {
  id: string;
  category: 'preference' | 'contact' | 'reminder' | 'fact';
  content: string;
  date: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
}
