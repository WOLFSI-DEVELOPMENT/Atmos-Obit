const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// 1. Add imports at the top
content = content.replace(
  "import { GoogleGenAI } from '@google/genai';",
  "import { GoogleGenAI } from '@google/genai';\nimport OpenAI from 'openai';\nimport Anthropic from '@anthropic-ai/sdk';"
);

// 2. Replace the generation logic
const startTarget = "const response = await client.models.generateContent({";
const endTarget = "const reply = response.text || '';";

const startIndex = content.indexOf(startTarget);
const endIndex = content.indexOf(endTarget) + endTarget.length;

const newGenLogic = `
      let reply = '';
      
      if (finalModelName.startsWith('gpt-')) {
        const openai = new OpenAI({ apiKey: apiKey, baseURL: baseUrl || undefined });
        const messages = [];
        if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
        
        const history = session ? session.history : [{ role: 'user', parts: newParts }];
        for (const msg of history) {
            let text = "";
            let imagePart = null;
            for (const part of msg.parts) {
                if (part.text) text += part.text;
                if (part.inlineData) {
                    imagePart = {
                        type: "image_url",
                        image_url: {
                            url: \`data:\${part.inlineData.mimeType};base64,\${part.inlineData.data}\`
                        }
                    };
                }
            }
            if (imagePart) {
                 messages.push({ role: msg.role === 'model' ? 'assistant' : 'user', content: [{ type: "text", text: text }, imagePart] });
            } else {
                 messages.push({ role: msg.role === 'model' ? 'assistant' : 'user', content: text });
            }
        }
        
        let oaiConfig = {
            model: finalModelName,
            messages,
        };
        // O1 and some reasoning models might not support system prompts or some features, but GPT-5.6 should be fine.
        
        const res = await openai.chat.completions.create(oaiConfig);
        reply = res.choices[0]?.message?.content || '';
        
      } else if (finalModelName.startsWith('claude-')) {
        const anthropic = new Anthropic({ apiKey: apiKey, baseURL: baseUrl || undefined });
        const messages = [];
        const history = session ? session.history : [{ role: 'user', parts: newParts }];
        
        for (const msg of history) {
            const contents = [];
            for (const part of msg.parts) {
                if (part.text) contents.push({ type: "text", text: part.text });
                if (part.inlineData) {
                    contents.push({
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: part.inlineData.mimeType,
                            data: part.inlineData.data
                        }
                    });
                }
            }
            messages.push({ role: msg.role === 'model' ? 'assistant' : 'user', content: contents });
        }
        
        const res = await anthropic.messages.create({
            model: finalModelName,
            system: systemInstruction,
            max_tokens: 4096,
            messages
        });
        reply = res.content.find(c => c.type === 'text')?.text || '';
        
      } else {
        const response = await client.models.generateContent({
          model: finalModelName,
          contents: session ? session.history : [{ role: 'user', parts: newParts }],
          config: {
            thinkingConfig,
            systemInstruction
          }
        });
        reply = response.text || '';
      }
`;

content = content.substring(0, startIndex) + newGenLogic + content.substring(endIndex);
fs.writeFileSync('server.ts', content);
console.log('patched server.ts');
