const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

types = types.replace(
  "export type ThinkingLevel = 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';",
  "export type ThinkingLevel = 'NONE' | 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'XHIGH' | 'MAX';"
);

types += `
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
`;

fs.writeFileSync('src/types.ts', types);
console.log('updated types');
