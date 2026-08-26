// Robust Roblox Luau Parser and Instance Engine Emulator
// Handles parsing of Luau code into 3D Scene Instances and 2D GUI Layouts

export interface RobloxInstance {
  id: string;
  varName: string;
  className: string;
  name: string;
  properties: Record<string, any>;
  parentVar: string | null;
  children: RobloxInstance[];
}

// Extensive Roblox BrickColor table mapped to hex RGB
export const BRICK_COLORS: Record<string, string> = {
  'white': '#F2F3F3',
  'institutional white': '#F8F8F8',
  'really white': '#FFFFFF',
  'medium stone grey': '#A3A2A5',
  'dark stone grey': '#635F62',
  'black': '#1B2A35',
  'really black': '#111111',
  'ghost grey': '#CBC9C9',
  'flint': '#696663',
  'gun powder': '#525353',
  'bright red': '#C4281C',
  'really red': '#FF0000',
  'crimson': '#970000',
  'dusty rose': '#CC8E69',
  'pastel reddish orange': '#FFB082',
  'bright orange': '#DA8541',
  'neon orange': '#D75500',
  'deep orange': '#E25B1D',
  'rust': '#8F4C2A',
  'bright yellow': '#F5CD30',
  'cool yellow': '#FDFF92',
  'pastel yellow': '#FFF89A',
  'gold': '#ECA814',
  'sand yellow': '#96815B',
  'bright green': '#4B974B',
  'dark green': '#285F28',
  'earth green': '#27462D',
  'camo': '#3A4B29',
  'lime green': '#A1E41B',
  'pastel green': '#CCFFCC',
  'bright bluish green': '#00908F',
  'slime green': '#48CA58',
  'parsley green': '#2C651D',
  'bright blue': '#0D69AC',
  'really blue': '#0000FF',
  'deep blue': '#2154B9',
  'navy blue': '#002060',
  'dark blue': '#1F3463',
  'pastel blue': '#AFDDFF',
  'light blue': '#B4D2E4',
  'cyan': '#04AFEC',
  'teal': '#128B84',
  'sand blue': '#74869D',
  'pastel violet': '#D1E3FF',
  'lilac': '#A793D4',
  'magenta': '#AA00AA',
  'hot pink': '#FF66CC',
  'pink': '#FFAEC9',
  'royal purple': '#6B327C',
  'plum': '#7B007B',
  'bright violet': '#6B327C',
  'lavender': '#8C5B9F',
  'medium blue': '#5A73BE',
  'brick yellow': '#D7C59A',
  'nougat': '#CC8E69',
  'light orange': '#E29B40',
  'reddish brown': '#694027',
  'dark orange': '#A05F35',
  'pine green': '#1C4A3A',
  'sea green': '#37825F',
  'fog': '#C1D1E0',
  'smoky grey': '#5A5D5E',
  'silver': '#CCCCCC',
  'bronze': '#6E4924',
};

export const parseBrickColor = (str: string): string => {
  const clean = str.toLowerCase().replace(/['"]/g, '').trim();
  if (clean === 'random' || clean === 'random()') {
    const keys = Object.keys(BRICK_COLORS);
    return BRICK_COLORS[keys[Math.floor(Math.random() * keys.length)]];
  }
  return BRICK_COLORS[clean] || '#A3A2A5';
};

export const extractNumber = (str: string): number => {
  if (!str) return 0;
  const match = str.match(/-?\d*\.?\d+/);
  return match ? parseFloat(match[0]) : 0;
};

export const parseHexColor = (hex: string): string => {
  let clean = hex.replace(/['"#]/g, '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return '#ffffff';
};

export const parsePropValue = (valStr: string): any => {
  if (!valStr) return null;
  const trimmed = valStr.trim();

  // UDim2.new(xScale, xOffset, yScale, yOffset)
  let m = trimmed.match(/UDim2\.new\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    return {
      type: 'UDim2',
      xScale: extractNumber(m[1]),
      xOffset: extractNumber(m[2]),
      yScale: extractNumber(m[3]),
      yOffset: extractNumber(m[4]),
    };
  }
  // UDim2.fromOffset(x, y)
  m = trimmed.match(/UDim2\.fromOffset\(([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    return { type: 'UDim2', xScale: 0, xOffset: extractNumber(m[1]), yScale: 0, yOffset: extractNumber(m[2]) };
  }
  // UDim2.fromScale(x, y)
  m = trimmed.match(/UDim2\.fromScale\(([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    return { type: 'UDim2', xScale: extractNumber(m[1]), xOffset: 0, yScale: extractNumber(m[2]), yOffset: 0 };
  }

  // UDim.new(scale, offset)
  m = trimmed.match(/UDim\.new\(([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    return { type: 'UDim', scale: extractNumber(m[1]), offset: extractNumber(m[2]) };
  }

  // Color3.fromRGB(r, g, b)
  m = trimmed.match(/Color3\.fromRGB\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    const r = Math.min(255, Math.max(0, Math.round(extractNumber(m[1]))));
    const g = Math.min(255, Math.max(0, Math.round(extractNumber(m[2]))));
    const b = Math.min(255, Math.max(0, Math.round(extractNumber(m[3]))));
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Color3.fromHex("...")
  m = trimmed.match(/Color3\.fromHex\(([^)]+)\)/i);
  if (m) {
    return parseHexColor(m[1]);
  }

  // Color3.new(r, g, b) [0..1 or 0..255]
  m = trimmed.match(/Color3\.new\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    const rVal = extractNumber(m[1]);
    const gVal = extractNumber(m[2]);
    const bVal = extractNumber(m[3]);
    const r = rVal <= 1 && gVal <= 1 && bVal <= 1 ? Math.round(rVal * 255) : Math.round(rVal);
    const g = rVal <= 1 && gVal <= 1 && bVal <= 1 ? Math.round(gVal * 255) : Math.round(gVal);
    const b = rVal <= 1 && gVal <= 1 && bVal <= 1 ? Math.round(bVal * 255) : Math.round(bVal);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // BrickColor.new(...)
  m = trimmed.match(/BrickColor\.new\(([^)]+)\)/i);
  if (m) {
    return parseBrickColor(m[1]);
  }
  if (/BrickColor\.(Red|Blue|White|Black|Green|Yellow|Gray|DarkGray)\(\)/i.test(trimmed)) {
    const colorType = trimmed.match(/BrickColor\.([a-zA-Z]+)\(\)/i)?.[1].toLowerCase();
    return BRICK_COLORS[colorType || 'bright red'] || '#FF0000';
  }

  // Vector3.new(x, y, z)
  m = trimmed.match(/Vector3\.new\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    return [extractNumber(m[1]), extractNumber(m[2]), extractNumber(m[3])];
  }

  // Vector2.new(x, y)
  m = trimmed.match(/Vector2\.new\(([^,]+),\s*([^\)]+)\)/i);
  if (m) {
    return { type: 'Vector2', x: extractNumber(m[1]), y: extractNumber(m[2]) };
  }

  // CFrame.new(x, y, z)
  m = trimmed.match(/CFrame\.new\(([^,]+),\s*([^,]+),\s*([^\)]+)/i);
  if (m) {
    return [extractNumber(m[1]), extractNumber(m[2]), extractNumber(m[3])];
  }

  // Enum values
  m = trimmed.match(/Enum\.([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)/i);
  if (m) {
    return m[2]; // return the enum member name (e.g. 'Neon', 'Smooth', 'Ball', 'Left')
  }

  // Booleans
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // Strings
  m = trimmed.match(/^"([^"]*)"$/) || trimmed.match(/^'([^']*)'$/) || trimmed.match(/^\[\[([\s\S]*?)\]\]$/);
  if (m) return m[1];

  // Numbers
  if (!isNaN(Number(trimmed))) {
    return Number(trimmed);
  }

  return trimmed;
};

// Clean code to remove comments, long docstrings, and normalize
export const preprocessLuauCode = (code: string): string => {
  return code
    .replace(/--\[\[[\s\S]*?\]\]/g, '') // remove multiline comments
    .replace(/--.*$/gm, '') // remove single-line comments
    .replace(/\r\n/g, '\n');
};

export const parseLuauInstances = (code: string): RobloxInstance[] => {
  if (!code || typeof code !== 'string') return [];

  const clean = preprocessLuauCode(code);
  const instances: Record<string, RobloxInstance> = {};
  const lines = clean.split('\n');

  // Helper to register an instance
  const registerInstance = (varName: string, className: string, parentVarName?: string | null) => {
    if (!varName) return;
    const id = `${varName}_${Math.random().toString(36).substring(2, 9)}`;
    instances[varName] = {
      id,
      varName,
      className: className.trim(),
      name: varName,
      properties: {},
      parentVar: parentVarName || null,
      children: [],
    };
  };

  // Pass 1: Handle simple for loops that create repetitive parts or items
  // e.g., for i = 1, 10 do local part = Instance.new("Part", workspace) ... end
  const forLoopRegex = /for\s+([a-zA-Z0-9_]+)\s*=\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\s+do([\s\S]*?)end/g;
  let loopMatch;
  let expandedCode = clean;

  // Simple safe loop unroller (up to max 25 iterations to prevent lag)
  while ((loopMatch = forLoopRegex.exec(clean)) !== null) {
    const varIter = loopMatch[1];
    const start = parseInt(loopMatch[2], 10);
    const end = Math.min(parseInt(loopMatch[3], 10), start + 24);
    const step = loopMatch[4] ? parseInt(loopMatch[4], 10) : 1;
    const body = loopMatch[5];

    let unrolled = '';
    for (let i = start; i <= end; i += step) {
      // replace occurrences of iter var with actual number
      const iterBody = body.replace(new RegExp(`\\b${varIter}\\b`, 'g'), i.toString())
                           .replace(/([a-zA-Z0-9_]+)\s*=\s*Instance\.new/g, `$1_${i} = Instance.new`);
      unrolled += '\n' + iterBody;
    }
    expandedCode += '\n' + unrolled;
  }

  const allLines = expandedCode.split('\n');

  // Pass 2: Instance.new detections
  // Handles:
  // local x = Instance.new("Part")
  // local x = Instance.new("Part", parent)
  // x = Instance.new("Frame")
  for (let line of allLines) {
    line = line.trim();
    if (!line) continue;

    // Instance.new with optional 2nd argument parent
    const match2Arg = line.match(/(?:local\s+)?([a-zA-Z0-9_]+)\s*=\s*Instance\.new\(\s*["']([^"']+)["']\s*(?:,\s*([^)]+))?\s*\)/i);
    if (match2Arg) {
      const varName = match2Arg[1];
      const className = match2Arg[2];
      const parentExpr = match2Arg[3] ? match2Arg[3].trim() : null;

      let parentVar: string | null = null;
      if (parentExpr) {
        if (/workspace|game\.Workspace/i.test(parentExpr)) {
          parentVar = 'workspace';
        } else if (/StarterGui|PlayerGui/i.test(parentExpr)) {
          parentVar = 'StarterGui';
        } else {
          parentVar = parentExpr.replace(/^([a-zA-Z0-9_]+).*/, '$1');
        }
      }
      registerInstance(varName, className, parentVar);
    }
  }

  // Pass 3: Property assignments & Parent links
  // e.g. part.Position = Vector3.new(0, 5, 0)
  // part.Parent = workspace
  // frame.Size = UDim2.new(1, 0, 1, 0)
  for (let line of allLines) {
    line = line.trim();
    if (!line) continue;

    const propMatch = line.match(/^([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
    if (propMatch) {
      const varName = propMatch[1];
      const propName = propMatch[2];
      const valStr = propMatch[3].replace(/;$/, '').trim();

      if (instances[varName]) {
        if (propName === 'Parent') {
          if (/workspace|game\.Workspace/i.test(valStr)) {
            instances[varName].parentVar = 'workspace';
          } else if (/StarterGui|PlayerGui/i.test(valStr)) {
            instances[varName].parentVar = 'StarterGui';
          } else if (instances[valStr]) {
            instances[varName].parentVar = valStr;
          } else {
            instances[varName].parentVar = valStr;
          }
        } else if (propName === 'Name') {
          const parsed = parsePropValue(valStr);
          if (typeof parsed === 'string') {
            instances[varName].name = parsed;
          }
          instances[varName].properties[propName] = parsed;
        } else if (propName === 'BrickColor') {
          const colorHex = parsePropValue(valStr);
          instances[varName].properties['Color'] = colorHex;
          instances[varName].properties['BrickColor'] = colorHex;
        } else if (propName === 'CFrame') {
          const cframeVal = parsePropValue(valStr);
          if (Array.isArray(cframeVal)) {
            instances[varName].properties['Position'] = cframeVal;
          }
          instances[varName].properties['CFrame'] = cframeVal;
        } else {
          instances[varName].properties[propName] = parsePropValue(valStr);
        }
      }
    }
  }

  // Link children to parents
  const instanceList = Object.values(instances);
  for (const inst of instanceList) {
    if (inst.parentVar && instances[inst.parentVar]) {
      instances[inst.parentVar].children.push(inst);
    }
  }

  // Fallback: If no 3D parts were parsed from the code, inject a rich default Roblox game environment
  // so the preview is never empty and matches Roblox Studio experience.
  const has3DParts = instanceList.some(i => ['Part', 'WedgePart', 'SpawnLocation', 'MeshPart', 'UnionOperation'].includes(i.className));
  if (!has3DParts) {
    const defaultParts = [
      { name: 'SpawnLocation', className: 'SpawnLocation', pos: [0, 0.5, 0], size: [6, 1, 6], color: '#ef4444' },
      { name: 'Platform1', className: 'Part', pos: [0, 0.5, -12], size: [10, 1, 10], color: '#3b82f6' },
      { name: 'Platform2', className: 'Part', pos: [12, 2.5, -24], size: [8, 1, 8], color: '#10b981' },
      { name: 'Platform3', className: 'Part', pos: [-12, 4.5, -36], size: [8, 1, 8], color: '#f59e0b' },
      { name: 'WallLeft', className: 'Part', pos: [-16, 3, -18], size: [2, 6, 24], color: '#6366f1' },
      { name: 'WallRight', className: 'Part', pos: [16, 3, -18], size: [2, 6, 24], color: '#6366f1' },
    ];

    for (const dp of defaultParts) {
      const id = `${dp.name}_${Math.random().toString(36).substring(2, 9)}`;
      const newInst: RobloxInstance = {
        id,
        varName: dp.name,
        className: dp.className,
        name: dp.name,
        properties: {
          Position: dp.pos,
          Size: dp.size,
          Color: dp.color,
          Transparency: 0,
        },
        parentVar: 'workspace',
        children: [],
      };
      instanceList.push(newInst);
    }
  }

  return instanceList;
};

// Aggregate all Luau files from project into one coherent preview payload
export const aggregateProjectLuau = (files: { path: string; content: string }[]): string => {
  if (!files || files.length === 0) return '';

  // Sort files so that GUI and Workspace systems are ordered logically
  const luauFiles = files.filter(f => f.path.endsWith('.luau') || f.path.endsWith('.lua'));
  if (luauFiles.length === 0) {
    // If no .luau files found, return any file content
    return files.map(f => f.content).join('\n\n');
  }

  return luauFiles.map(f => `-- File: ${f.path}\n${f.content}`).join('\n\n');
};
