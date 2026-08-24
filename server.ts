import { createServer as createViteServer } from 'vite';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { execFile } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import ffmpegPath from 'ffmpeg-static';

const execFileAsync = promisify(execFile);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const DATABASE_URL = process.env.DATABASE_URL || '';
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.warn('DATABASE_URL is not set');
}
const sql = neon(DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// In-memory store for sync sessions
interface Session {
  pin: string;
  status: 'waiting' | 'connected';
  pendingCode: { id: string; code: string; type: 'Script' | 'LocalScript' | 'ModuleScript' | 'Command'; path?: string }[];
  gameState?: any;
  generatedFiles: { path: string; type: string; content: string; }[];
  lastActive: number;
  history: { role: 'user' | 'model'; parts: any[] }[];
}



let dbInitialized = false;
async function ensureDb() {
  if (dbInitialized || !DATABASE_URL) return;
  await sql`
    CREATE TABLE IF NOT EXISTS sync_sessions (
      pin VARCHAR(6) PRIMARY KEY,
      status VARCHAR(20) NOT NULL,
      pending_code JSONB NOT NULL DEFAULT '[]',
      game_state JSONB,
      generated_files JSONB NOT NULL DEFAULT '[]',
      history JSONB NOT NULL DEFAULT '[]',
      last_active BIGINT NOT NULL
    );
  `;
  dbInitialized = true;
}

async function getSession(pin: string) {
  if (!DATABASE_URL) return null;
  await ensureDb();
  const rows = await sql`SELECT * FROM sync_sessions WHERE pin = ${pin}`;
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    pin: row.pin,
    status: row.status,
    pendingCode: row.pending_code,
    gameState: row.game_state,
    generatedFiles: row.generated_files,
    history: row.history,
    lastActive: Number(row.last_active)
  };
}

async function saveSession(session: any) {
  if (!DATABASE_URL) return;
  await ensureDb();
  await sql`
    INSERT INTO sync_sessions (pin, status, pending_code, game_state, generated_files, history, last_active)
    VALUES (${session.pin}, ${session.status}, ${JSON.stringify(session.pendingCode)}, ${session.gameState ? JSON.stringify(session.gameState) : null}, ${JSON.stringify(session.generatedFiles)}, ${JSON.stringify(session.history)}, ${session.lastActive})
    ON CONFLICT (pin) DO UPDATE SET
      status = EXCLUDED.status,
      pending_code = EXCLUDED.pending_code,
      game_state = EXCLUDED.game_state,
      generated_files = EXCLUDED.generated_files,
      history = EXCLUDED.history,
      last_active = EXCLUDED.last_active;
  `;
}

async function cleanupStaleSessions() {
  if (!DATABASE_URL) return;
  await ensureDb();
  const cutoff = Date.now() - 1000 * 60 * 60;
  await sql`DELETE FROM sync_sessions WHERE last_active < ${cutoff}`;
}

export const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// --- API Routes ---

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 1. Web App: Create a new PIN session
app.post('/api/sync/create', async (req, res) => {
  // Generate 6 letter PIN
  let pin = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 6; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const session = {
    pin,
    status: 'waiting',
    pendingCode: [], gameState: null,
    generatedFiles: [],
    lastActive: Date.now(),
    history: []
  };
  await saveSession(session);
  // Cleanup occasionally
  if (Math.random() < 0.1) cleanupStaleSessions().catch(console.error);
  
  res.json({ pin });
});

// 1b. Web App: Restore or create a session with history
app.post('/api/sync/restore', async (req, res) => {
  const { pin, history, files } = req.body;
  if (!pin) return res.status(400).json({ error: 'PIN is required' });
  
  let session = await getSession(pin);
  if (!session) {
    session = {
      pin,
      status: 'waiting',
      pendingCode: [], gameState: null,
      generatedFiles: files || [],
      lastActive: Date.now(),
      history: history || []
    };
  } else {
    if (history && session.history.length === 0) {
      session.history = history;
    }
    if (files && session.generatedFiles.length === 0) {
      session.generatedFiles = files;
    }
    session.lastActive = Date.now();
  }
  await saveSession(session);
  
  res.json({ success: true, status: session.status, history: session.history });
});

// 2. Web App: Check session status
app.get('/api/sync/status/:pin', async (req, res) => {
  const session = await getSession(req.params.pin);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.lastActive = Date.now();
  await saveSession(session);
  res.json({ status: session.status });
});

// 3. Plugin: Connect to session
app.post('/api/plugin/connect', async (req, res) => {
  console.log('Plugin connect request body:', req.body);
  const { pin } = req.body;
  const session = await getSession(pin);
  if (!session) {
      console.log('Invalid PIN:', pin);
      return res.status(404).json({ error: 'Invalid PIN' });
  }
  
  session.status = 'connected';
  session.lastActive = Date.now();
  await saveSession(session);
  res.json({ success: true, message: 'Connected to VibeCoder' });
});

// 4. Plugin: Poll for pending code
app.get('/api/plugin/poll/:pin', async (req, res) => {
  const session = await getSession(req.params.pin);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  
  session.lastActive = Date.now();
  const codeToSync = [...session.pendingCode];
  session.pendingCode = []; // Clear queue after fetching
  
  await saveSession(session);
  res.json({ pending: codeToSync });
});

// 4c. Web App: Get current game state
app.get('/api/sync/state/:pin', async (req, res) => {
  const session = await getSession(req.params.pin);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  
  res.json({ state: session.gameState || {}, files: session.generatedFiles || [] });
});

// 4b. Plugin: Push current game state
app.post('/api/plugin/state', async (req, res) => {
  const { pin, state } = req.body;
  const session = await getSession(pin);
  if (!session) return res.status(404).json({ error: 'Invalid PIN' });
  
  session.gameState = state;
  session.lastActive = Date.now();
  await saveSession(session);
  res.json({ success: true });
});

// 5. Web App: Send Chat to AI and Queue Code
app.post('/api/chat', async (req, res) => {
  const { message, pin, image, model, apiKey, baseUrl, thinkingConfig, allowToolbox, allowIconGen, assetPreference, responseTone, guiStyle, orchestratorEnabled } = req.body;
  
  try {
    const session = pin ? await getSession(pin) : null;
    const gameStateContext = session?.gameState ? `\n\nCurrent Roblox Game State:\n${JSON.stringify(session.gameState, null, 2)}` : '';

    const newParts: any[] = [{ text: message }];
    if (image) {
      newParts.push({
        inlineData: {
          data: image.split(',')[1],
          mimeType: image.split(',')[0].split(':')[1].split(';')[0],
        },
      });
    }

    if (session) {
      session.history.push({ role: 'user', parts: newParts });
    }

    const selectedModelName = model || 'gemini-3.5-flash';
    
    const clientOptions: any = {};
    if (apiKey) clientOptions.apiKey = apiKey;
    if (baseUrl) clientOptions.baseUrl = baseUrl;
    const client = (apiKey || baseUrl) ? new GoogleGenAI(clientOptions) : ai;

    // Construct dynamic system instructions based on permissions
    let toolboxCapability = allowToolbox 
      ? `5. Search & Add from Toolbox: Output a JSON object with "type" set to "Asset", "query" (e.g. "epic sword", "background music", "brick texture"), and "assetType" ("Model", "Audio", or "Decal"). This will search the live Roblox Creator Marketplace (Toolbox) and automatically insert the best matching safe asset directly into the workspace!`
      : `5. Toolbox is DISABLED by the user. Do NOT output "Asset" types. Do NOT try to fetch assets from the marketplace.`;

    let iconCapability = allowIconGen !== false
      ? `4. Generate UI Icons: Output a JSON object with "type" set to "Icon", "prompt" (e.g. "a flat 2d rock icon"), and "name" (e.g. "Rocks"). This will generate an image and return the hosted URL.`
      : `4. Icon Generation is DISABLED by the user. Do NOT output "Icon" types. Use standard text or built-in Roblox image IDs.`;

    let assetInstruction = '';
    if (assetPreference === 'custom') {
      assetInstruction = `\n\nCRITICAL ASSET PREFERENCE: The user has requested CUSTOM PARTS. You must NOT use the Toolbox to fetch pre-made models. Instead, you MUST build structures, objects, and levels purely using primitive Parts, Meshes, and CSG (UnionAsync/SubtractAsync) via Studio Commands.`;
    }

    let toneInstruction = '';
    if (responseTone && responseTone !== 'default') {
      if (responseTone === 'concise') toneInstruction = 'Your tone should be highly concise, direct, and to the point. No fluff or unnecessary explanations.';
      else if (responseTone === 'friendly') toneInstruction = 'Your tone should be friendly, encouraging, and highly explanatory for a beginner.';
      else if (responseTone === 'professional') toneInstruction = 'Your tone should be strictly professional, technical, and analytical.';
      else if (responseTone === 'pirate') toneInstruction = 'Your tone should be that of a stereotypical pirate. Say Yarr and use pirate slang in your explanation.';
    }

    let styleInstruction = '';
    if (guiStyle && guiStyle !== 'default') {
      if (guiStyle === 'flat') styleInstruction = 'When generating ScreenGuis or UI, strictly use a Modern Flat design (clean, minimal, standard padding, subtle colors).';
      else if (guiStyle === 'cartoon') styleInstruction = 'When generating ScreenGuis or UI, strictly use a Cartoon/Simulator design (bubbly, bright saturated colors, heavy UI strokes, large corner radii, bold fonts).';
      else if (guiStyle === 'scifi') styleInstruction = 'When generating ScreenGuis or UI, strictly use a Sci-Fi design (neon accents, dark transparent backgrounds, angular cuts, glow effects, monospace or futuristic fonts).';
      else if (guiStyle === 'retro') styleInstruction = 'When generating ScreenGuis or UI, strictly use a Retro/Pixel design (blocky, highly pixelated styling, high contrast, 8-bit aesthetic).';
    }

    let finalModelName = selectedModelName;
    
    if (orchestratorEnabled !== false && !apiKey && !baseUrl) {
      try {
        const routerResponse = await client.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: `Analyze the user request and choose the most appropriate Gemini model.
Options:
- gemini-3.1-pro-preview (For complex coding, large scripts, architecture design, logic, and debugging)
- gemini-3.5-flash (For standard coding, general changes, UI creation)
- gemini-3.5-flash-lite (For very simple questions, basic edits, greetings, or short tasks)

User Request: "${message}"

Output ONLY the exact model ID from the options above. Nothing else.`,
        });
        const suggestedModel = routerResponse.text?.trim() || '';
        if (['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'].includes(suggestedModel)) {
          finalModelName = suggestedModel;
          console.log(`[Orchestrator] Routed "${message.substring(0, 20)}..." to ${finalModelName}`);
        }
      } catch (e) {
        console.error("Orchestrator routing failed, falling back to selected model", e);
      }
    }

    const behaviorInstructions = [toneInstruction, styleInstruction].filter(Boolean).map(i => `\n\nCRITICAL PREFERENCE: ${i}`).join('');

    const systemInstruction = `You are VibeCoder, an expert Roblox Luau AI coding assistant.${gameStateContext}
You have full remote control over the user's Roblox Studio environment. You can write scripts, manipulate the 3D world, change game settings, and fetch assets directly from the Toolbox (Creator Marketplace).${assetInstruction}${behaviorInstructions}

Capabilities:

1. Create a new file: Output a JSON object with "type" set to "Script", "LocalScript", or "ModuleScript", a "path" (e.g. "ServerScriptService.MyScript"), and "content".
2. Edit an existing file: Output a JSON object with "type" set to "Edit", the "path", the exact "find" string you want to replace, and the "replace" string. This is faster and prevents bugs from rewriting the whole file. The "find" block must match EXACTLY.
3. Run Studio Commands (Full Power): Output a JSON object with "type" set to "Command", and "content" with raw Lua. This Lua code is executed directly in Roblox Studio with plugin-level permissions. You have LIMITLESS control. Examples of what you can and should do:
 - Level & World Building: Spawn and position Parts, Meshes, and Models. Group them into Folders/Models.
 - Terrain Generation: Use workspace.Terrain methods (FillBlock, FillBall, WriteVoxels) to generate biomes, water, and landscapes.
 - Lighting & Atmosphere: Configure game.Lighting. Add Skyboxes, SunRays, Bloom, ColorCorrection, Atmosphere, and adjust ClockTime/Brightness.
 - GUI Creation: Generate complete ScreenGuis, Frames, TextLabels, TextButtons, and UILayouts (UIListLayout, UIGridLayout) dynamically in StarterGui.
 - Physics & Constraints: Rig parts together using WeldConstraints, HingeConstraints, SpringConstraints, or AlignPosition. Apply VectorForces or AngularVelocity.
 - NPC & Pathfinding: Spawn R15/R6 dummy rigs, use PathfindingService to map out routes, and make NPCs move.
 - Services & Organization: Use CollectionService to tag objects. Configure Teams and SpawnLocations. Set up Leaderstats via PlayerAdded events in commands.
 - Audio & VFX: Spawn Sound instances, configure SoundGroups, or emit ParticleEmitters.
 - CSG (Solid Modeling): Dynamically use UnionAsync or SubtractAsync to carve and combine parts into complex custom geometry.
 - DataStores & Analytics: Query DataStoreService to inspect, modify, or seed player data dynamically.
 - Animation & Cinematics: Script Camera.CFrame for cutscenes, create Animation objects, and use TweenService for rich motion.
 - Custom Materials & Textures: Use MaterialService to generate MaterialVariants and apply PBR texturing dynamically.
${iconCapability}
${toolboxCapability}

Format:
{
"explanation": "Brief explanation",
"edits": [
  { "type": "Edit", "path": "ServerScriptService.MyScript", "find": "old code...", "replace": "new code..." },
  { "type": "Script", "path": "StarterPlayer.StarterPlayerScripts.NewScript", "content": "..." },
  { "type": "Command", "content": "local part = Instance.new('Part'); part.Size = Vector3.new(10, 10, 10); part.Parent = workspace" },
  { "type": "Icon", "prompt": "flat 2d rock icon", "name": "Rocks" },
  { "type": "Asset", "query": "epic sword", "assetType": "Model" }
]
}
DO NOT use markdown code blocks for the code. Only output the JSON.`;

    
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
                          url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
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

    let explanation = reply;
    
    if (session) {
      session.history.push({ role: 'model', parts: [{ text: reply }] });
    }

    // Parse JSON
    let diffs = [];
    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          explanation = data.explanation || 'Code generated.';
          
          if (session) {
              const editsArray = data.edits || data.files || [];
              for (const edit of editsArray) {
                  if (edit.type === 'Icon') {
                      try {
                          const iconPrompt = (edit.prompt || edit.name || 'icon') + ' flat 2d vector icon solid green screen background';
                          
                              let imgUrl = '';
                              
                              try {
                                  const imgResp = await fetch('https://gateway.pixazo.ai/flux-1-schnell/v1/getData', {
                                      method: 'POST',
                                      headers: {
                                          'Content-Type': 'application/json',
                                          'Cache-Control': 'no-cache',
                                          'Ocp-Apim-Subscription-Key': process.env.PIXAZO_API_KEY || ''
                                      },
                                      body: JSON.stringify({
                                          prompt: iconPrompt,
                                          num_steps: 4,
                                          height: 512,
                                          width: 512
                                      })
                                  });
                                  const imgData = await imgResp.json();
                                  if (imgData && imgData.output) {
                                      imgUrl = imgData.output;
                                  } else {
                                      throw new Error('Invalid Flux API response');
                                  }
                              } catch (fluxErr) {
                                  console.warn('Flux API failed, falling back to pollinations:', fluxErr);
                                  imgUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(iconPrompt) + '?width=512&height=512&nologo=true';
                              }
                              
                              const tempInput = path.join(process.cwd(), 'temp_' + crypto.randomBytes(4).toString('hex') + '.jpg');
                              const tempOutput = tempInput.replace('.jpg', '.png');
                              
                              // Download from chosen output URL
                              const fluxImgResp = await fetch(imgUrl);
                              const fluxImgBuffer = await fluxImgResp.arrayBuffer();
                              fs.writeFileSync(tempInput, Buffer.from(fluxImgBuffer));
                              
                              // Remove green screen with ffmpeg
                              await execFileAsync(ffmpegPath as string, ['-y', '-i', tempInput, '-vf', 'chromakey=0x00FF00:0.1:0.1', '-c:v', 'png', tempOutput]);
                              
                              // Upload to freeimage.host
                              const fileData = fs.readFileSync(tempOutput);
                              const blob = new Blob([fileData], { type: 'image/png' });
                              const formData = new FormData();
                              formData.append('key', process.env.FREEIMAGE_API_KEY || '6d207e02198a847aa98d0a2a901485a5');
                              formData.append('action', 'upload');
                              formData.append('format', 'json');
                              formData.append('source', blob, 'icon.png');
                              
                              const uploadResp = await fetch('https://freeimage.host/api/1/upload', {
                                  method: 'POST',
                                  body: formData
                              });
                              const uploadData = await uploadResp.json();
                              
                              // Clean up temps
                              fs.unlinkSync(tempInput);
                              fs.unlinkSync(tempOutput);
                              
                              if (uploadData && uploadData.image && uploadData.image.url) {
                                  explanation += `\n\nGenerated Icon URL for ${edit.name}: ${uploadData.image.url}`;
                                  session.pendingCode.push({
                                      id: Math.random().toString(36).substring(7),
                                      type: 'Command',
                                      code: `-- Generated Icon for ${edit.name}: ${uploadData.image.url}\nprint("Generated icon: ${uploadData.image.url}")`
                                  });
                              } else {
                                  throw new Error('Failed to upload transparent image');
                              }
                      } catch (err) {
                          console.error('Error generating icon:', err);
                          explanation += `\n\nFailed to generate icon ${edit.name}.`;
                      }
                  } else if (edit.type === 'Asset') {
                      try {
                          const searchQuery = encodeURIComponent(edit.query || 'item');
                          const assetTypeStr = edit.assetType === 'Audio' ? 'Audio' : (edit.assetType === 'Decal' ? 'Decals' : 'Models');
                          
                          const catalogResp = await fetch(`https://catalog.roblox.com/v1/search/items?category=${assetTypeStr}&keyword=${searchQuery}&limit=10`);
                          const catalogData = await catalogResp.json();
                          
                          let foundId = null;
                          if (catalogData && catalogData.data && catalogData.data.length > 0) {
                              // Pick the first valid asset ID
                              foundId = catalogData.data[0].id;
                          } else {
                              // Fallback placeholder if search fails or returns nothing
                              foundId = Math.floor(Math.random() * 9000000) + 1000000;
                          }
                          
                          const luaCode = `local InsertService = game:GetService("InsertService")
local success, result = pcall(function()
  return InsertService:LoadAsset(${foundId})
end)
if success and result then
  result.Parent = workspace
  print("Successfully inserted ${edit.assetType} '${edit.query}' (ID: ${foundId}) into workspace")
else
  warn("Failed to load ${edit.assetType} '${edit.query}' (ID: ${foundId}). Note: Some assets may not be loadable via script or require manual insertion.")
end`;

                          explanation += `\n\nFetched ${edit.assetType} for "${edit.query}": rbxassetid://${foundId}`;
                          session.pendingCode.push({
                              id: Math.random().toString(36).substring(7),
                              type: 'Command',
                              code: luaCode
                          });
                      } catch (err) {
                          console.error('Error fetching asset:', err);
                          const fallbackId = Math.floor(Math.random() * 9000000) + 1000000;
                          const fallbackLua = `local InsertService = game:GetService("InsertService")
local success, result = pcall(function() return InsertService:LoadAsset(${fallbackId}) end)
if success and result then result.Parent = workspace end`;
                          
                          explanation += `\n\nFetched ${edit.assetType} for "${edit.query}" (fallback): rbxassetid://${fallbackId}`;
                          
                          const commandPath = `Fetch_Asset_${new Date().toLocaleTimeString().replace(/:/g, '')}.luau`;
                          session.generatedFiles.push({ path: commandPath, type: 'Command', content: fallbackLua });
                          diffs.push({ path: commandPath, linesAdded: fallbackLua.split('\n').length, linesRemoved: 0 });

                          session.pendingCode.push({
                              id: Math.random().toString(36).substring(7),
                              type: 'Command',
                              code: fallbackLua
                          });
                      }
                  } else if (edit.type === 'Command') {
                      const commandCode = edit.content || edit.code || '';
                      const commandPath = `Studio_Command_${new Date().toLocaleTimeString().replace(/:/g, '')}.luau`;
                      session.generatedFiles.push({ path: commandPath, type: edit.type, content: commandCode });
                      diffs.push({ path: commandPath, linesAdded: commandCode.split('\n').length, linesRemoved: 0 });
                      
                      session.pendingCode.push({
                          id: Math.random().toString(36).substring(7),
                          type: edit.type,
                          code: commandCode
                      });
                  } else if (edit.type === 'Edit') {
                      let existingFile = session.generatedFiles.find(f => f.path === edit.path);
                      if (existingFile && edit.find) {
                          if (existingFile.content.includes(edit.find)) {
                              existingFile.content = existingFile.content.replace(edit.find, edit.replace);
                              const linesRemoved = edit.find.split('\n').length;
                              const linesAdded = edit.replace.split('\n').length;
                              diffs.push({ path: edit.path, linesAdded, linesRemoved });
                              
                              session.pendingCode.push({
                                  id: Math.random().toString(36).substring(7),
                                  type: existingFile.type as "Script" | "LocalScript" | "ModuleScript" | "Command",
                                  path: existingFile.path,
                                  code: existingFile.content
                              });
                          }
                      }
                  } else {
                      // New file or overwrite
                      let existingFile = session.generatedFiles.find(f => f.path === edit.path);
                      const newContent = edit.content || edit.code || '';
                      const linesAdded = newContent.split('\n').length;
                      
                      if (existingFile) {
                          const linesRemoved = existingFile.content.split('\n').length;
                          existingFile.content = newContent;
                          diffs.push({ path: edit.path, linesAdded, linesRemoved });
                      } else {
                          session.generatedFiles.push({ path: edit.path, type: edit.type, content: newContent });
                          diffs.push({ path: edit.path, linesAdded, linesRemoved: 0 });
                      }
                      
                      session.pendingCode.push({
                          id: Math.random().toString(36).substring(7),
                          type: edit.type,
                          path: edit.path,
                          code: newContent
                      });
                  }
              }
          }
      }
    } catch (e) {
        console.error('Failed to parse AI JSON response', e);
    }
    
    if (session) {
      // Find the last model message we just pushed and add diffs to it
      const lastMsg = session.history[session.history.length - 1];
      if (lastMsg.role === 'model') {
         (lastMsg as any).diffs = diffs;
      }
    }
    
    if (session) await saveSession(session);
    res.json({ reply: explanation, diffs, files: session?.generatedFiles || [] });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Custom Auth Endpoints ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) return res.status(400).json({ error: 'User already exists' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await sql`INSERT INTO users (email, password, name) VALUES (${email}, ${passwordHash}, ${name || ''}) RETURNING id, email, name`;
    const user = result[0];
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.json({ user: null });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const rows = await sql`SELECT payload FROM user_data WHERE user_id = ${decoded.id}`;
    let data = null;
    if (rows.length > 0) {
      data = rows[0].payload;
    }
    res.json({ user: decoded, data });
  } catch (err) {
    res.json({ user: null });
  }
});
  

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});


// --- User Data Persistence ---
app.get('/api/user/data', async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const rows = await sql`SELECT payload FROM user_data WHERE user_id = ${decoded.id}`;
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0].payload });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/user/data', async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const payload = req.body;
    
    await sql`
      INSERT INTO user_data (user_id, payload)
      VALUES (${decoded.id}, ${JSON.stringify(payload)})
      ON CONFLICT (user_id) DO UPDATE SET payload = EXCLUDED.payload;
    `;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Catch-all for API routes to prevent them from falling through to the SPA index.html
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});


// --- Vite Middleware ---

if (!process.env.VERCEL) {
  (async () => {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
    
    const PORT = 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })();
}
