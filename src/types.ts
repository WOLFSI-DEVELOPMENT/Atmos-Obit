export interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string;
  diffs?: { path: string; linesAdded: number; linesRemoved: number }[];
}

export interface Project {
  id: string; // matches the pin or a unique id
  name: string;
  pin: string;
  createdAt: number;
  status: 'waiting' | 'connected';
  messages: Message[];
}

export type ThinkingLevel = 'NONE' | 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'XHIGH' | 'MAX';

export interface GeminiModelInfo {
  id: string;
  name: string;
  label: string;
  desc: string;
  supportedLevels: ThinkingLevel[];
  defaultLevel: ThinkingLevel;
}

export const GEMINI_MODELS: GeminiModelInfo[] = [
  {
    id: 'gemini-3.7-flash',
    name: 'gemini-3.7-flash',
    label: 'Gemini 3.7 Flash',
    desc: 'The latest Flash model.',
    supportedLevels: ['LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'gemini-3.6-flash',
    name: 'gemini-3.6-flash',
    label: 'Gemini 3.6 Flash',
    desc: 'Previous generation Flash model.',
    supportedLevels: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'gemini-3.5-flash',
    name: 'gemini-3.5-flash',
    label: 'Gemini 3.5 Flash',
    desc: 'Default, highly balanced intelligence & speed.',
    supportedLevels: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'gemini-3.5-flash-lite',
    label: 'Gemini 3.5 Flash-Lite',
    desc: 'Lightweight and fast Flash model.',
    supportedLevels: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'MINIMAL'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'gemini-3.1-pro-preview',
    label: 'Gemini 3.1 Pro (Preview)',
    desc: 'Advanced reasoning, complex logic & elite coding.',
    supportedLevels: ['LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'HIGH'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'gemini-3-flash-preview',
    label: 'Gemini 3 Flash (Preview)',
    desc: 'Preview of Gemini 3 Flash.',
    supportedLevels: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'HIGH'
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'gemini-3.1-flash-lite',
    label: 'Gemini 3.1 Flash-Lite',
    desc: 'Ultra low-latency, snappy and light response.',
    supportedLevels: ['MINIMAL', 'LOW', 'MEDIUM', 'HIGH'],
    defaultLevel: 'MINIMAL'
  },
  {
    id: 'gemini-3.1-flash-lite-image',
    name: 'gemini-3.1-flash-lite-image',
    label: 'Gemini 3.1 Flash-Lite Image',
    desc: 'Image generation capable lite model.',
    supportedLevels: ['MINIMAL', 'HIGH'],
    defaultLevel: 'MINIMAL'
  }
];

export const OPENAI_MODELS: GeminiModelInfo[] = [
  {
    id: 'gpt-5.6-sol',
    name: 'gpt-5.6-sol',
    label: 'GPT-5.6 Sol (Flagship)',
    desc: 'Maximum reasoning depth for complex professional or coding work.',
    supportedLevels: ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'gpt-5.6-terra',
    name: 'gpt-5.6-terra',
    label: 'GPT-5.6 Terra (Balanced)',
    desc: 'Balanced execution and intelligence.',
    supportedLevels: ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'gpt-5.6-luna',
    name: 'gpt-5.6-luna',
    label: 'GPT-5.6 Luna (Cost-Efficient)',
    desc: 'Cost-efficient model for everyday tasks.',
    supportedLevels: ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'],
    defaultLevel: 'MEDIUM'
  }
];

export const ANTHROPIC_MODELS: GeminiModelInfo[] = [
  {
    id: 'claude-fable-5',
    name: 'claude-fable-5',
    label: 'Claude Fable 5',
    desc: 'Frontier capability for massive enterprise reasoning and multi-day workflows.',
    supportedLevels: ['LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'claude-opus-5',
    name: 'claude-opus-5',
    label: 'Claude Opus 5',
    desc: 'Balanced and proactive daily-use model.',
    supportedLevels: ['LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'],
    defaultLevel: 'MEDIUM'
  },
  {
    id: 'claude-sonnet-5',
    name: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    desc: 'Fast, agentic execution and scaled autonomous tool utilization.',
    supportedLevels: ['LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'],
    defaultLevel: 'MEDIUM'
  }
];
