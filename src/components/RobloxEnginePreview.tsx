import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const RealisticSky3D = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const skyRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
    if (skyRef.current) {
      // Keep skybox centered on camera to avoid clipping when panning far
      skyRef.current.position.copy(state.camera.position);
    }
  });

  const vertexShader = `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec3 vPosition;

    float hash(float n) { return fract(sin(n) * 1e4); }
    float noise(vec3 x) {
        const vec3 step = vec3(110.0, 241.0, 171.0);
        vec3 i = floor(x);
        vec3 f = fract(x);
        float n = dot(i, step);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix( hash(n + dot(step, vec3(0.0, 0.0, 0.0))), hash(n + dot(step, vec3(1.0, 0.0, 0.0))), u.x),
                       mix( hash(n + dot(step, vec3(0.0, 1.0, 0.0))), hash(n + dot(step, vec3(1.0, 1.0, 0.0))), u.x), u.y),
                   mix(mix( hash(n + dot(step, vec3(0.0, 0.0, 1.0))), hash(n + dot(step, vec3(1.0, 0.0, 1.0))), u.x),
                       mix( hash(n + dot(step, vec3(0.0, 1.0, 1.0))), hash(n + dot(step, vec3(1.0, 1.0, 1.0))), u.x), u.y), u.z);
    }
    
    const mat3 m3 = mat3( 0.00,  0.80,  0.60,
                         -0.80,  0.36, -0.48,
                         -0.60, -0.48,  0.64 );
                         
    float fbm(vec3 p) {
        float f = 0.0;
        f += 0.5000 * noise(p); p = m3 * p * 2.02;
        f += 0.2500 * noise(p); p = m3 * p * 2.03;
        f += 0.1250 * noise(p); p = m3 * p * 2.01;
        f += 0.0625 * noise(p);
        return f / 0.9375;
    }

    void main() {
      vec3 dir = normalize(vPosition);
      
      vec3 color1 = vec3(0.17, 0.36, 0.56); // #2c5d8f
      vec3 color2 = vec3(0.51, 0.69, 0.84); // #82b0d6
      vec3 color3 = vec3(0.93, 0.91, 0.86); // #ede8dc
      
      float h = dir.y;
      vec3 skyColor = mix(color3, color2, smoothstep(0.0, 0.3, h));
      skyColor = mix(skyColor, color1, smoothstep(0.3, 1.0, h));
      
      // Horizon ambient glow
      skyColor += vec3(0.15, 0.07, 0.0) * (1.0 - smoothstep(0.0, 0.15, h)) * 0.4;

      // Animated procedural clouds
      float c1 = fbm(dir * 3.0 + vec3(time * 0.01, 0.0, time * 0.015));
      float c2 = fbm(dir * 6.0 + vec3(time * 0.02, 0.0, -time * 0.01));

      float cloudDensity1 = smoothstep(0.4, 0.8, c1) * smoothstep(0.0, 0.3, h);
      float cloudDensity2 = smoothstep(0.5, 0.9, c2) * smoothstep(0.05, 0.4, h);

      vec3 cloudColor1 = vec3(0.95, 0.95, 0.95);
      vec3 cloudColor2 = vec3(1.0, 1.0, 1.0);

      vec3 finalColor = mix(skyColor, cloudColor1, cloudDensity1 * 0.6);
      finalColor = mix(finalColor, cloudColor2, cloudDensity2 * 0.7);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={skyRef}>
      <sphereGeometry args={[40000, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.BackSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ time: { value: 0 } }}
        depthWrite={false}
      />
    </mesh>
  );
};

function useBaseplateTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const color1 = '#5b5e62'; // Darker checker
    const color2 = '#63666b'; // Lighter checker
    const lineColor = '#4b4d51'; // Grid line
    
    // Background (Light checker)
    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, 1024, 1024);

    // Dark checker
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillRect(512, 512, 512, 512);

    // Lines
    ctx.fillStyle = lineColor;
    const lineWidth = 6;
    for (let i = 0; i <= 1024; i += 128) {
      ctx.fillRect(i - lineWidth/2, 0, lineWidth, 1024);
      ctx.fillRect(0, i - lineWidth/2, 1024, lineWidth);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    texture.repeat.set(64, 64);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }, []);
}

function Baseplate() {
  const texture = useBaseplateTexture();
  return (
    <mesh position={[0, -8, 0]} receiveShadow>
      <boxGeometry args={[16384, 16, 16384]} />
      <meshStandardMaterial 
        map={texture || undefined} 
        color={texture ? "#ffffff" : "#63666b"}
        roughness={0.9} 
        metalness={0.0}
      />
    </mesh>
  );
}

// A generic mock interpreter to parse "Instance.new" commands
// and render them in the Three.js canvas (for Parts) or HTML DOM (for GUI).

interface MockInstance {
  id: string;
  varName: string;
  type: string;
  properties: Record<string, any>;
  parentVar: string | null;
}

const extractNumber = (str: string) => {
  const match = str.match(/-?\d*\.?\d+/);
  return match ? parseFloat(match[0]) : 0;
};

const parsePropValue = (valStr: string) => {
  // UDim2
  let m = valStr.match(/UDim2\.new\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return { type: 'UDim2', xScale: extractNumber(m[1]), xOffset: extractNumber(m[2]), yScale: extractNumber(m[3]), yOffset: extractNumber(m[4]) };
  }
  m = valStr.match(/UDim2\.fromOffset\(([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return { type: 'UDim2', xScale: 0, xOffset: extractNumber(m[1]), yScale: 0, yOffset: extractNumber(m[2]) };
  }
  m = valStr.match(/UDim2\.fromScale\(([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return { type: 'UDim2', xScale: extractNumber(m[1]), xOffset: 0, yScale: extractNumber(m[2]), yOffset: 0 };
  }
  // UDim
  m = valStr.match(/UDim\.new\(([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return { type: 'UDim', scale: extractNumber(m[1]), offset: extractNumber(m[2]) };
  }
  // Color3.fromRGB
  m = valStr.match(/Color3\.fromRGB\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return `rgb(${extractNumber(m[1])}, ${extractNumber(m[2])}, ${extractNumber(m[3])})`;
  }
  m = valStr.match(/Color3\.new\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return `rgb(${Math.floor(extractNumber(m[1])*255)}, ${Math.floor(extractNumber(m[2])*255)}, ${Math.floor(extractNumber(m[3])*255)})`;
  }
  // Vector3
  m = valStr.match(/Vector3\.new\(([^,]+),\s*([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return [extractNumber(m[1]), extractNumber(m[2]), extractNumber(m[3])];
  }
  // Vector2
  m = valStr.match(/Vector2\.new\(([^,]+),\s*([^\)]+)\)/);
  if (m) {
    return { type: 'Vector2', x: extractNumber(m[1]), y: extractNumber(m[2]) };
  }
  
  // Booleans
  if (valStr === 'true') return true;
  if (valStr === 'false') return false;
  
  // Strings
  m = valStr.match(/^"([^"]*)"$/) || valStr.match(/^'([^']*)'$/);
  if (m) return m[1];
  
  // Numbers
  if (!isNaN(parseFloat(valStr))) return parseFloat(valStr);
  
  return valStr;
};

const parseLuauToInstances = (code: string): MockInstance[] => {
  const instances: Record<string, MockInstance> = {};
  
  const lines = code.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    // Allow Instance.new("Type") or Instance.new("Type", parent)
    const newMatch = line.match(/(?:local\s+)?([a-zA-Z0-9_]+)\s*=\s*Instance\.new\("([^"]+)"/);
    if (newMatch) {
      instances[newMatch[1]] = {
        id: Math.random().toString(),
        varName: newMatch[1],
        type: newMatch[2],
        properties: {},
        parentVar: null
      };
    }
  }

  for (let line of lines) {
    line = line.trim();
    const propMatch = line.match(/^([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
    if (propMatch) {
      const varName = propMatch[1];
      const propName = propMatch[2];
      const valStr = propMatch[3].replace(/;$/, '');
      
      if (instances[varName]) {
        if (propName === 'Parent') {
          const p = valStr.trim();
          if (instances[p]) {
            instances[varName].parentVar = p;
          }
        } else {
          instances[varName].properties[propName] = parsePropValue(valStr);
        }
      }
    }
  }
  return Object.values(instances);
};

function PartMesh({ instance }: { instance: MockInstance }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  const pos = instance.properties.Position || [0, 0, 0];
  const size = instance.properties.Size || [4, 1, 2];
  const color = instance.properties.Color || '#a3a2a5';
  const anchored = instance.properties.Anchored || false;

  useFrame(() => {
    if (meshRef.current && !anchored) {
      if (meshRef.current.position.y > size[1] / 2) {
        meshRef.current.position.y -= 0.1;
      }
    }
  });

  if (instance.type !== 'Part') return null;

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={hovered ? '#ffffff' : color} 
        roughness={0.8}
      />
      {hovered && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
          <lineBasicMaterial color="#00ff00" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

const RobloxGuiNode = ({ instance, instances }: { instance: MockInstance, instances: MockInstance[] }) => {
  const children = instances.filter(i => i.parentVar === instance.varName);
  const props = instance.properties;
  
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box'
  };

  // Size
  if (props.Size?.type === 'UDim2') {
    style.width = `calc(${props.Size.xScale * 100}% + ${props.Size.xOffset}px)`;
    style.height = `calc(${props.Size.yScale * 100}% + ${props.Size.yOffset}px)`;
  } else if (instance.type !== 'ScreenGui') {
    style.width = '100px';
    style.height = '100px';
  }

  // Position
  if (props.Position?.type === 'UDim2') {
    style.left = `calc(${props.Position.xScale * 100}% + ${props.Position.xOffset}px)`;
    style.top = `calc(${props.Position.yScale * 100}% + ${props.Position.yOffset}px)`;
  } else if (instance.type !== 'ScreenGui') {
    style.left = '0';
    style.top = '0';
  }

  // AnchorPoint
  if (props.AnchorPoint && Array.isArray(props.AnchorPoint)) {
    style.transform = `translate(-${props.AnchorPoint[0] * 100}%, -${props.AnchorPoint[1] * 100}%)`;
  } else if (props.AnchorPoint?.type === 'Vector2') {
    style.transform = `translate(-${props.AnchorPoint.x * 100}%, -${props.AnchorPoint.y * 100}%)`;
  }

  // Background
  if (props.BackgroundTransparency === 1 || instance.type === 'ScreenGui') {
    style.backgroundColor = 'transparent';
    style.border = 'none';
  } else {
    style.backgroundColor = props.BackgroundColor3 || '#ffffff';
    style.border = props.BorderSizePixel === 0 ? 'none' : '1px solid #000';
  }

  // UICorner support
  const uiCorner = children.find(c => c.type === 'UICorner');
  if (uiCorner) {
    const radius = uiCorner.properties.CornerRadius;
    if (radius?.type === 'UDim') {
       style.borderRadius = radius.offset > 0 ? `${radius.offset}px` : `${radius.scale * 100}%`;
    } else {
       style.borderRadius = '8px'; // default if UICorner is present but unconfigured
    }
  }

  // Text
  let textContent = null;
  if (['TextLabel', 'TextButton', 'TextBox'].includes(instance.type)) {
    textContent = props.Text !== undefined ? props.Text : instance.type;
    style.color = props.TextColor3 || '#000000';
    style.fontSize = props.TextSize ? `${props.TextSize}px` : '14px';
    style.display = 'flex';
    style.alignItems = 'center';
    style.justifyContent = 'center';
    if (props.TextXAlignment === 'Left') style.justifyContent = 'flex-start';
    if (props.TextXAlignment === 'Right') style.justifyContent = 'flex-end';
    if (props.TextYAlignment === 'Top') style.alignItems = 'flex-start';
    if (props.TextYAlignment === 'Bottom') style.alignItems = 'flex-end';
    style.fontFamily = props.Font === 'Enum.Font.Code' ? 'monospace' : 'sans-serif';
    if (props.TextTransparency !== undefined) style.opacity = 1 - props.TextTransparency;
    if (props.TextWrapped) style.textAlign = 'center';
  }

  // Image
  if (['ImageLabel', 'ImageButton'].includes(instance.type)) {
    if (typeof props.Image === 'string') {
      const src = props.Image.startsWith('rbxassetid://') 
        ? `https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId=${props.Image.replace('rbxassetid://', '')}`
        : props.Image;
      style.backgroundImage = `url(${src})`;
      style.backgroundSize = '100% 100%';
    }
  }

  if (instance.type === 'ScreenGui') {
    style.width = '100%';
    style.height = '100%';
  }
  
  if (['TextButton', 'ImageButton'].includes(instance.type)) {
    style.pointerEvents = 'auto'; // Buttons are interactive
  } else {
    style.pointerEvents = 'none'; // Allow clicking through non-interactive UI elements
  }

  const InnerTag = ['TextButton', 'ImageButton'].includes(instance.type) ? 'button' : 'div';
  const childGuiElements = ['Frame', 'TextLabel', 'TextButton', 'TextBox', 'ImageLabel', 'ImageButton', 'ScrollingFrame', 'ScreenGui'];

  return (
    <InnerTag style={style}>
      {textContent}
      {children.filter(c => childGuiElements.includes(c.type)).map(child => (
        <RobloxGuiNode key={child.id} instance={child} instances={instances} />
      ))}
    </InnerTag>
  );
};

const PlayerController = ({ isPlayMode }: { isPlayMode: boolean }) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const controlsRef = useRef<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const canJump = useRef(false);

  useEffect(() => {
    if (isPlayMode) {
      camera.position.set(0, 5, 0); // Reset position
      velocity.current.set(0, 0, 0);
    } else {
      if (controlsRef.current && controlsRef.current.isLocked) {
        controlsRef.current.unlock();
      }
      setIsLocked(false);
    }
  }, [isPlayMode, camera]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlayMode) return;
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = true;
          break;
        case 'Space':
          if (canJump.current) {
            velocity.current.y = 35.0; // Jump velocity
            canJump.current = false;
          }
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isPlayMode) return;
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = false;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlayMode]);

  useFrame((state, delta) => {
    if (!isPlayMode || !controlsRef.current || !controlsRef.current.isLocked) return;

    // Cap delta to prevent huge jumps on lag
    const dt = Math.min(delta, 0.1);

    const speed = 180.0;
    const friction = 15.0;
    const gravity = 90.0;

    // Apply friction with clamping to prevent oscillation (shaking)
    velocity.current.x -= velocity.current.x * Math.min(friction * dt, 1);
    velocity.current.z -= velocity.current.z * Math.min(friction * dt, 1);

    // Gravity
    velocity.current.y -= gravity * dt;

    direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward);
    direction.current.x = Number(moveState.current.right) - Number(moveState.current.left);
    direction.current.normalize(); // this ensures consistent movements in all directions

    if (moveState.current.forward || moveState.current.backward) velocity.current.z -= direction.current.z * speed * dt;
    if (moveState.current.left || moveState.current.right) velocity.current.x -= direction.current.x * speed * dt;

    controlsRef.current.moveRight(-velocity.current.x * dt);
    controlsRef.current.moveForward(-velocity.current.z * dt);
    
    // Apply Y velocity to camera
    camera.position.y += velocity.current.y * dt;
    
    // Floor collision
    if (camera.position.y < 5.0) {
      velocity.current.y = 0;
      camera.position.y = 5.0;
      canJump.current = true;
    }
  });

  return isPlayMode ? (
    <>
      <PointerLockControls 
        ref={controlsRef} 
        onLock={() => setIsLocked(true)} 
        onUnlock={() => setIsLocked(false)} 
      />
      {!isLocked && (
        <Html fullscreen style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
           <div className="bg-black/80 text-white px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
             <div className="text-lg font-bold">Click anywhere to play</div>
             <div className="text-neutral-400 text-sm flex gap-3">
               <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">W</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">A</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">S</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">D</kbd> to move</span>
               <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">SPACE</kbd> to jump</span>
               <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-300">ESC</kbd> to unlock</span>
             </div>
           </div>
        </Html>
      )}
    </>
  ) : null;
};

export function RobloxEnginePreview({ code, isPlayMode = false }: { code: string, isPlayMode?: boolean }) {
  const [instances, setInstances] = useState<MockInstance[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Basic mobile check
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setInstances(parseLuauToInstances(code));
  }, [code]);

  const parts = instances.filter(i => i.type === 'Part');
  
  // Find GUI roots (ScreenGuis or any UI element with no valid parent)
  const guiElements = ['ScreenGui', 'Frame', 'TextLabel', 'TextButton', 'TextBox', 'ImageLabel', 'ImageButton', 'ScrollingFrame'];
  const rootGuiInstances = instances.filter(i => 
    guiElements.includes(i.type) && (!i.parentVar || !instances.find(p => p.varName === i.parentVar))
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [15, 15, 15], fov: 50, far: 50000 }}>
          <RealisticSky3D />
          <fog attach="fog" args={['#ede8dc', 1000, 15000]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight 
            castShadow 
            position={[10, 20, 10]} 
            intensity={1.5} 
            shadow-mapSize={[1024, 1024]}
          />
          
          <Baseplate />

          {parts.map(part => (
            <PartMesh key={part.id} instance={part} />
          ))}
          
          {isPlayMode ? (
            <PlayerController isPlayMode={isPlayMode} />
          ) : (
            <OrbitControls 
              makeDefault 
              minDistance={2} 
              maxDistance={10000}
              enableDamping={true}
              dampingFactor={0.05}
              enablePan={true}
            />
          )}
        </Canvas>
      </div>

      {/* Mobile Play Mode Overlay */}
      {isMobile && isPlayMode && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-4">Mobile Support Coming Soon</h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Play mode currently requires a keyboard for movement. Please use a computer to access this platform and experience first-person mode.
            </p>
          </div>
        </div>
      )}

      {/* 2D GUI Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {rootGuiInstances.length > 0 && (
          <div className="absolute top-3 right-3 bg-black/80 border border-neutral-800 text-neutral-300 text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Press <strong className="text-white">Play</strong> (F5) in Studio to test GUI</span>
          </div>
        )}
        {rootGuiInstances.map(gui => (
          <RobloxGuiNode key={gui.id} instance={gui} instances={instances} />
        ))}
      </div>
    </div>
  );
}
