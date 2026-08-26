import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  RobloxInstance, 
  parseLuauInstances, 
  aggregateProjectLuau 
} from '../lib/robloxEngineParser';
import { 
  Maximize2, 
  Minimize2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Layers, 
  Box as BoxIcon, 
  Sparkles, 
  Info, 
  Eye, 
  Play, 
  Square, 
  MousePointer, 
  Check, 
  RotateCcw,
  Zap
} from 'lucide-react';

// --- Procedural Sky Shader ---
const RealisticSky3D = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const skyRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
    if (skyRef.current) {
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
      
      vec3 color1 = vec3(0.14, 0.32, 0.52); // Roblox Sky Zenith
      vec3 color2 = vec3(0.48, 0.67, 0.83); // Mid Sky
      vec3 color3 = vec3(0.92, 0.90, 0.85); // Horizon
      
      float h = dir.y;
      vec3 skyColor = mix(color3, color2, smoothstep(0.0, 0.35, h));
      skyColor = mix(skyColor, color1, smoothstep(0.35, 1.0, h));
      
      // Horizon ambient warmth
      skyColor += vec3(0.18, 0.09, 0.02) * (1.0 - smoothstep(0.0, 0.15, h)) * 0.4;

      // Animated volumetric procedural clouds
      float c1 = fbm(dir * 3.2 + vec3(time * 0.012, 0.0, time * 0.016));
      float c2 = fbm(dir * 6.5 + vec3(time * 0.022, 0.0, -time * 0.012));

      float cloudDensity1 = smoothstep(0.42, 0.82, c1) * smoothstep(0.0, 0.3, h);
      float cloudDensity2 = smoothstep(0.52, 0.92, c2) * smoothstep(0.05, 0.4, h);

      vec3 cloudColor1 = vec3(0.95, 0.95, 0.95);
      vec3 cloudColor2 = vec3(1.0, 1.0, 1.0);

      vec3 finalColor = mix(skyColor, cloudColor1, cloudDensity1 * 0.65);
      finalColor = mix(finalColor, cloudColor2, cloudDensity2 * 0.75);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh ref={skyRef}>
      <sphereGeometry args={[40000, 48, 48]} />
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

// --- Roblox Baseplate Grid Texture ---
function useBaseplateTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const color1 = '#52555a'; // Darker checker
    const color2 = '#5d6065'; // Lighter checker
    const lineColor = '#45474a'; // Grid line
    
    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillRect(512, 512, 512, 512);

    ctx.fillStyle = lineColor;
    const lineWidth = 4;
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
      <boxGeometry args={[8192, 16, 8192]} />
      <meshStandardMaterial 
        map={texture || undefined} 
        color={texture ? "#ffffff" : "#5d6065"}
        roughness={0.9} 
        metalness={0.0}
      />
    </mesh>
  );
}

// --- Spawn Decal Star for SpawnLocation ---
function SpawnLocationMarker({ position, size }: { position: [number, number, number], size: [number, number, number] }) {
  return (
    <group position={[position[0], position[1] + size[1] / 2 + 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Ring */}
      <mesh>
        <ringGeometry args={[size[0] * 0.35, size[0] * 0.42, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      {/* Inner Spawn Star Emblem */}
      <mesh>
        <circleGeometry args={[size[0] * 0.28, 5]} />
        <meshBasicMaterial color="#fcd34d" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// --- Dynamic Particle Sparks for ParticleEmitter ---
function ParticleSparks({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 30;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;

      vel[i * 3] = (Math.random() - 0.5) * 0.8;
      vel[i * 3 + 1] = Math.random() * 1.5 + 0.5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posArray[i * 3] += velocities[i * 3] * delta;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      if (posArray[i * 3 + 1] > 6) {
        posArray[i * 3] = (Math.random() - 0.5) * 2;
        posArray[i * 3 + 1] = 0;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#60a5fa"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- 3D Part Renderer ---
function PartMesh({ 
  instance, 
  allInstances,
  onSelect, 
  isSelected 
}: { 
  instance: RobloxInstance; 
  allInstances: RobloxInstance[];
  onSelect: (inst: RobloxInstance) => void; 
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  const props = instance.properties;
  const rawPos = props.Position || [0, 2, 0];
  const pos: [number, number, number] = Array.isArray(rawPos) ? [rawPos[0] || 0, rawPos[1] || 2, rawPos[2] || 0] : [0, 2, 0];
  
  const rawSize = props.Size || [4, 1.2, 4];
  const size: [number, number, number] = Array.isArray(rawSize) ? [Math.max(0.1, rawSize[0] || 4), Math.max(0.1, rawSize[1] || 1.2), Math.max(0.1, rawSize[2] || 4)] : [4, 1.2, 4];
  
  const color = props.Color || props.BrickColor || '#A3A2A5';
  const shape = (props.Shape || '').toString().toLowerCase();
  const materialType = (props.Material || '').toString().toLowerCase();
  const transparency = typeof props.Transparency === 'number' ? props.Transparency : 0;
  const reflectance = typeof props.Reflectance === 'number' ? props.Reflectance : 0;
  const anchored = props.Anchored !== undefined ? props.Anchored : true;
  const isNeon = materialType === 'neon';
  const isGlass = materialType === 'glass';
  const isMetal = materialType.includes('metal') || materialType.includes('diamondplate');

  // Check children for Lights, Particles, Decals
  const children = allInstances.filter(i => i.parentVar === instance.varName);
  const pointLightChild = children.find(c => c.className === 'PointLight' || c.className === 'SurfaceLight');
  const particleChild = children.find(c => c.className === 'ParticleEmitter');

  // Shape geometry selection
  let geometry = useMemo(() => {
    if (shape === 'ball' || shape === 'sphere' || instance.className === 'Ball') {
      return <sphereGeometry args={[Math.min(size[0], size[1], size[2]) / 2, 32, 32]} />;
    }
    if (shape === 'cylinder' || instance.className === 'Cylinder') {
      return <cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 32]} />;
    }
    if (shape === 'wedge' || instance.className === 'WedgePart') {
      const geom = new THREE.BufferGeometry();
      const sx = size[0] / 2, sy = size[1] / 2, sz = size[2] / 2;
      // 5-face wedge geometry
      const vertices = new Float32Array([
        // Bottom Face
        -sx, -sy, -sz,   sx, -sy, -sz,   sx, -sy,  sz,
        -sx, -sy, -sz,   sx, -sy,  sz,  -sx, -sy,  sz,
        // Back Face
        -sx, -sy, -sz,  -sx,  sy, -sz,   sx,  sy, -sz,
        -sx, -sy, -sz,   sx,  sy, -sz,   sx, -sy, -sz,
        // Slanted Face
        -sx,  sy, -sz,  -sx, -sy,  sz,   sx, -sy,  sz,
        -sx,  sy, -sz,   sx, -sy,  sz,   sx,  sy, -sz,
        // Left Triangle
        -sx, -sy, -sz,  -sx, -sy,  sz,  -sx,  sy, -sz,
        // Right Triangle
         sx, -sy, -sz,   sx,  sy, -sz,   sx, -sy,  sz,
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geom.computeVertexNormals();
      return <primitive object={geom} attach="geometry" />;
    }
    return <boxGeometry args={size} />;
  }, [shape, instance.className, size[0], size[1], size[2]]);

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(instance);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
        castShadow
        receiveShadow
      >
        {geometry}
        <meshStandardMaterial 
          color={color}
          roughness={isGlass ? 0.1 : isMetal ? 0.25 : 0.6}
          metalness={isMetal ? 0.85 : reflectance}
          emissive={isNeon ? color : '#000000'}
          emissiveIntensity={isNeon ? 1.8 : 0}
          transparent={transparency > 0 || isGlass}
          opacity={isGlass ? 0.5 : Math.max(0.05, 1 - transparency)}
        />
        {(hovered || isSelected) && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
            <lineBasicMaterial color={isSelected ? "#38bdf8" : "#22c55e"} linewidth={2} />
          </lineSegments>
        )}
      </mesh>

      {/* SpawnLocation Star Emblem */}
      {instance.className === 'SpawnLocation' && (
        <SpawnLocationMarker position={[0, 0, 0]} size={size} />
      )}

      {/* Embedded PointLight */}
      {pointLightChild && (
        <pointLight 
          color={pointLightChild.properties.Color || pointLightChild.properties.BrickColor || color} 
          intensity={pointLightChild.properties.Brightness || 2.5} 
          distance={pointLightChild.properties.Range || 18} 
        />
      )}

      {/* Embedded Particle Emitter */}
      {particleChild && (
        <ParticleSparks position={[0, size[1] / 2, 0]} />
      )}
    </group>
  );
}

// --- 2D Roblox GUI Node Renderer ---
const RobloxGuiNode = ({ 
  instance, 
  allInstances,
  onSelect,
  isSelected
}: { 
  instance: RobloxInstance; 
  allInstances: RobloxInstance[];
  onSelect: (inst: RobloxInstance) => void;
  isSelected?: boolean;
}) => {
  const children = allInstances.filter(i => i.parentVar === instance.varName);
  const props = instance.properties;
  
  const style: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  };

  // UDim2 Size
  if (props.Size?.type === 'UDim2') {
    style.width = `calc(${props.Size.xScale * 100}% + ${props.Size.xOffset}px)`;
    style.height = `calc(${props.Size.yScale * 100}% + ${props.Size.yOffset}px)`;
  } else if (instance.className === 'ScreenGui') {
    style.width = '100%';
    style.height = '100%';
  } else {
    style.width = '140px';
    style.height = '48px';
  }

  // UDim2 Position
  if (props.Position?.type === 'UDim2') {
    style.left = `calc(${props.Position.xScale * 100}% + ${props.Position.xOffset}px)`;
    style.top = `calc(${props.Position.yScale * 100}% + ${props.Position.yOffset}px)`;
  } else if (instance.className !== 'ScreenGui') {
    style.left = '0';
    style.top = '0';
  }

  // Vector2 AnchorPoint
  if (props.AnchorPoint && Array.isArray(props.AnchorPoint)) {
    style.transform = `translate(-${props.AnchorPoint[0] * 100}%, -${props.AnchorPoint[1] * 100}%)`;
  } else if (props.AnchorPoint?.type === 'Vector2') {
    style.transform = `translate(-${props.AnchorPoint.x * 100}%, -${props.AnchorPoint.y * 100}%)`;
  }

  // Background Transparency & Color
  if (props.BackgroundTransparency === 1 || instance.className === 'ScreenGui') {
    style.backgroundColor = 'transparent';
  } else {
    style.backgroundColor = props.BackgroundColor3 || props.BrickColor || '#252528';
    if (typeof props.BackgroundTransparency === 'number' && props.BackgroundTransparency > 0) {
      style.opacity = 1 - props.BackgroundTransparency;
    }
  }

  // Border & UICorner
  const uiCorner = children.find(c => c.className === 'UICorner');
  if (uiCorner) {
    const radius = uiCorner.properties.CornerRadius;
    if (radius?.type === 'UDim') {
      style.borderRadius = radius.offset > 0 ? `${radius.offset}px` : `${radius.scale * 100}%`;
    } else {
      style.borderRadius = '12px';
    }
  } else {
    style.borderRadius = props.BorderSizePixel === 0 ? '0px' : '4px';
  }

  // UIStroke
  const uiStroke = children.find(c => c.className === 'UIStroke');
  if (uiStroke) {
    const thickness = uiStroke.properties.Thickness || 2;
    const strokeColor = uiStroke.properties.Color || '#ffffff';
    style.border = `${thickness}px solid ${strokeColor}`;
  } else if (props.BorderSizePixel && props.BorderSizePixel > 0) {
    style.border = `${props.BorderSizePixel}px solid ${props.BorderColor3 || '#000000'}`;
  } else {
    style.border = 'none';
  }

  // UIGradient
  const uiGradient = children.find(c => c.className === 'UIGradient');
  if (uiGradient && props.BackgroundTransparency !== 1) {
    const rot = uiGradient.properties.Rotation || 90;
    style.background = `linear-gradient(${rot}deg, ${props.BackgroundColor3 || '#3b82f6'}, rgba(255,255,255,0.15))`;
  }

  // UIPadding
  const uiPadding = children.find(c => c.className === 'UIPadding');
  if (uiPadding) {
    const pTop = uiPadding.properties.PaddingTop?.offset || 0;
    const pBottom = uiPadding.properties.PaddingBottom?.offset || 0;
    const pLeft = uiPadding.properties.PaddingLeft?.offset || 0;
    const pRight = uiPadding.properties.PaddingRight?.offset || 0;
    style.padding = `${pTop}px ${pRight}px ${pBottom}px ${pLeft}px`;
  }

  // UIListLayout auto flex
  const uiListLayout = children.find(c => c.className === 'UIListLayout');
  if (uiListLayout) {
    style.display = 'flex';
    style.flexDirection = uiListLayout.properties.FillDirection === 'Horizontal' ? 'row' : 'column';
    const paddingOffset = uiListLayout.properties.Padding?.offset || 8;
    style.gap = `${paddingOffset}px`;
    style.alignItems = 'center';
  }

  // Text Properties
  let textContent = null;
  const isTextElement = ['TextLabel', 'TextButton', 'TextBox'].includes(instance.className);
  if (isTextElement) {
    textContent = props.Text !== undefined ? props.Text : instance.name || instance.className;
    style.color = props.TextColor3 || '#ffffff';
    style.fontSize = props.TextSize ? `${props.TextSize}px` : props.TextScaled ? '16px' : '14px';
    style.fontWeight = '600';
    style.display = style.display || 'flex';
    style.alignItems = style.alignItems || 'center';
    style.justifyContent = 'center';
    
    if (props.TextXAlignment === 'Left') style.justifyContent = 'flex-start';
    if (props.TextXAlignment === 'Right') style.justifyContent = 'flex-end';
    if (props.TextYAlignment === 'Top') style.alignItems = 'flex-start';
    if (props.TextYAlignment === 'Bottom') style.alignItems = 'flex-end';
    
    // Font mapping
    const font = (props.Font || '').toString().toLowerCase();
    if (font.includes('code') || font.includes('mono')) style.fontFamily = 'monospace';
    else if (font.includes('fredoka') || font.includes('luckiest') || font.includes('cartoon')) style.fontFamily = '"Fredoka", "Comic Sans MS", cursive, sans-serif';
    else if (font.includes('gotham') || font.includes('sans')) style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    if (props.TextStrokeColor3) {
      style.textShadow = `0px 1px 2px ${props.TextStrokeColor3}, 0px -1px 2px ${props.TextStrokeColor3}`;
    }
  }

  // Image Properties
  if (['ImageLabel', 'ImageButton'].includes(instance.className)) {
    if (typeof props.Image === 'string' && props.Image.length > 0) {
      const rawImg = props.Image;
      const src = rawImg.startsWith('rbxassetid://') 
        ? `https://www.roblox.com/asset-thumbnail/image?width=420&height=420&format=png&assetId=${rawImg.replace('rbxassetid://', '')}`
        : rawImg;
      style.backgroundImage = `url(${src})`;
      style.backgroundSize = 'contain';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
    } else {
      // Stylized Roblox Image fallback
      style.backgroundColor = props.BackgroundColor3 || '#2c2d30';
    }
  }

  const isButton = ['TextButton', 'ImageButton'].includes(instance.className);
  if (isButton) {
    style.pointerEvents = 'auto';
    style.cursor = 'pointer';
    style.userSelect = 'none';
  } else if (instance.className === 'ScreenGui') {
    style.pointerEvents = 'none';
  } else {
    style.pointerEvents = 'auto';
  }

  const [clickCount, setClickCount] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(instance);
    if (isButton) {
      setClickCount(prev => prev + 1);
    }
  };

  const InnerTag = isButton ? 'button' : 'div';
  const childGuiElements = ['Frame', 'TextLabel', 'TextButton', 'TextBox', 'ImageLabel', 'ImageButton', 'ScrollingFrame', 'ScreenGui'];

  return (
    <InnerTag 
      style={style}
      onClick={handleClick}
      className={`relative ${isButton ? 'hover:brightness-110 active:scale-95' : ''} ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
    >
      {textContent}
      {isButton && clickCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-black font-bold text-[9px] px-1.5 py-0.5 rounded-full animate-bounce">
          +{clickCount}
        </span>
      )}
      {children.filter(c => childGuiElements.includes(c.className)).map(child => (
        <RobloxGuiNode 
          key={child.id} 
          instance={child} 
          allInstances={allInstances}
          onSelect={onSelect}
          isSelected={isSelected}
        />
      ))}
    </InnerTag>
  );
};

// --- First-Person Player Controller ---
const PlayerController = ({ isPlayMode }: { isPlayMode: boolean }) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });
  const controlsRef = useRef<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const canJump = useRef(false);

  useEffect(() => {
    if (isPlayMode) {
      camera.position.set(0, 5, 12);
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
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.current.sprint = true;
          break;
        case 'Space':
          if (canJump.current) {
            velocity.current.y = 42.0;
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
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.current.sprint = false;
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

  useFrame((_, delta) => {
    if (!isPlayMode || !controlsRef.current || !controlsRef.current.isLocked) return;

    const dt = Math.min(delta, 0.1);
    const speed = moveState.current.sprint ? 280.0 : 180.0;
    const friction = 14.0;
    const gravity = 85.0;

    velocity.current.x -= velocity.current.x * Math.min(friction * dt, 1);
    velocity.current.z -= velocity.current.z * Math.min(friction * dt, 1);
    velocity.current.y -= gravity * dt;

    direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward);
    direction.current.x = Number(moveState.current.right) - Number(moveState.current.left);
    direction.current.normalize();

    if (moveState.current.forward || moveState.current.backward) velocity.current.z -= direction.current.z * speed * dt;
    if (moveState.current.left || moveState.current.right) velocity.current.x -= direction.current.x * speed * dt;

    controlsRef.current.moveRight(-velocity.current.x * dt);
    controlsRef.current.moveForward(-velocity.current.z * dt);
    
    camera.position.y += velocity.current.y * dt;
    
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
        <Html fullscreen style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-black/85 text-white px-6 py-5 rounded-2xl border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Zap size={18} className="text-amber-400" />
              <span>Click anywhere to start playtest</span>
            </div>
            <div className="text-neutral-400 text-xs flex items-center gap-3">
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-200">W A S D</kbd> to move</span>
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-200">SHIFT</kbd> sprint</span>
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-200">SPACE</kbd> jump</span>
              <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-neutral-200">ESC</kbd> unlock</span>
            </div>
          </div>
        </Html>
      )}
    </>
  ) : null;
};

// --- Main Engine Preview Component ---
interface RobloxEnginePreviewProps {
  code?: string;
  files?: { path: string; type: string; content: string }[];
  isPlayMode?: boolean;
  devicePreset?: 'pc' | 'mobile' | 'tablet';
}

export function RobloxEnginePreview({ code = '', files, isPlayMode = false, devicePreset = 'pc' }: RobloxEnginePreviewProps) {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(-1); // -1 = All Files Combined
  const [selectedInstance, setSelectedInstance] = useState<RobloxInstance | null>(null);
  const [viewMode, setViewMode] = useState<'both' | '3d' | 'gui'>('both');

  // Compute active Luau payload
  const activeLuau = useMemo(() => {
    if (files && files.length > 0) {
      if (selectedFileIdx >= 0 && files[selectedFileIdx]) {
        return files[selectedFileIdx].content;
      }
      return aggregateProjectLuau(files);
    }
    return code;
  }, [code, files, selectedFileIdx]);

  // Parse instances from active Luau
  const instances = useMemo(() => {
    return parseLuauInstances(activeLuau);
  }, [activeLuau]);

  // Filter 3D workspace parts and 2D UI roots
  const parts3D = useMemo(() => {
    const partClassNames = ['Part', 'WedgePart', 'CornerWedgePart', 'TrussPart', 'SpawnLocation', 'MeshPart', 'UnionOperation'];
    return instances.filter(i => partClassNames.includes(i.className));
  }, [instances]);

  const guiRoots = useMemo(() => {
    const guiClassNames = ['ScreenGui', 'Frame', 'TextLabel', 'TextButton', 'TextBox', 'ImageLabel', 'ImageButton', 'ScrollingFrame'];
    return instances.filter(i => 
      guiClassNames.includes(i.className) && (!i.parentVar || i.parentVar === 'StarterGui' || !instances.find(p => p.varName === i.parentVar))
    );
  }, [instances]);

  // Viewport resolution preset
  const viewportStyles = useMemo(() => {
    if (devicePreset === 'mobile') {
      return { width: '390px', height: '844px', borderRadius: '44px', border: '12px solid #1c1c1e', overflow: 'hidden' };
    }
    if (devicePreset === 'tablet') {
      return { width: '768px', height: '1024px', borderRadius: '28px', border: '10px solid #1c1c1e', overflow: 'hidden' };
    }
    return { width: '100%', height: '100%' };
  }, [devicePreset]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0c] flex flex-col select-none">
      {/* Main Canvas Viewport Container */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black p-0">
        <div style={viewportStyles} className="relative transition-all duration-300 shadow-2xl">
          {/* 3D Three.js Canvas */}
          {(viewMode === 'both' || viewMode === '3d') && (
            <div className="absolute inset-0 z-10">
              <Canvas 
                shadows={{ type: THREE.PCFShadowMap }} 
                camera={{ position: [16, 16, 18], fov: 50, far: 50000 }}
                gl={{ antialias: true, alpha: false }}
              >
                <RealisticSky3D />
                <fog attach="fog" args={['#ede8dc', 1200, 16000]} />
                
                <ambientLight intensity={0.65} />
                <directionalLight 
                  castShadow 
                  position={[25, 45, 20]} 
                  intensity={1.8} 
                  shadow-mapSize={[1024, 1024]}
                  shadow-bias={-0.0001}
                />
                
                <Baseplate />

                {parts3D.map(part => (
                  <PartMesh 
                    key={part.id} 
                    instance={part} 
                    allInstances={instances}
                    onSelect={setSelectedInstance}
                    isSelected={selectedInstance?.id === part.id}
                  />
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
          )}

          {/* 2D GUI Overlay */}
          {(viewMode === 'both' || viewMode === 'gui') && (
            <div className={`absolute inset-0 z-20 ${viewMode === 'gui' ? 'bg-[#0f0f12]' : 'pointer-events-none'}`}>
              {guiRoots.length > 0 && (
                <div className="absolute top-3 right-3 bg-black/80 border border-neutral-800 text-neutral-300 text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 pointer-events-auto shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Press <strong className="text-white">Play</strong> (F5) in Studio to test GUI</span>
                </div>
              )}
              {guiRoots.map(gui => (
                <RobloxGuiNode 
                  key={gui.id} 
                  instance={gui} 
                  allInstances={instances}
                  onSelect={setSelectedInstance}
                  isSelected={selectedInstance?.id === gui.id}
                />
              ))}
            </div>
          )}

          {/* Empty State Helper when no instances parsed */}
          {instances.length === 0 && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6 text-center pointer-events-none">
              <div className="bg-[#141416]/90 border border-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm text-neutral-400 text-xs space-y-2">
                <Sparkles size={20} className="mx-auto text-blue-400" />
                <h4 className="text-white font-medium text-sm">Waiting for Roblox Instances</h4>
                <p>Prompt the AI to create parts, GUIs, maps, or leaderboards to watch them render live in this viewport.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Inspector Drawer */}
      {selectedInstance && (
        <div className="h-28 border-t border-white/10 bg-[#121214] px-4 py-2.5 flex items-center justify-between z-30 text-xs shrink-0">
          <div className="space-y-1 overflow-hidden pr-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-400 font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase">
                {selectedInstance.className}
              </span>
              <strong className="text-white text-sm font-semibold truncate">{selectedInstance.name}</strong>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-1 text-neutral-400 text-[11px]">
              {selectedInstance.properties.Position && (
                <div><span className="text-neutral-500">Position:</span> {JSON.stringify(selectedInstance.properties.Position)}</div>
              )}
              {selectedInstance.properties.Size && (
                <div><span className="text-neutral-500">Size:</span> {JSON.stringify(selectedInstance.properties.Size)}</div>
              )}
              {selectedInstance.properties.Color && (
                <div className="flex items-center gap-1">
                  <span className="text-neutral-500">Color:</span>
                  <span className="w-3 h-3 rounded-full inline-block border border-white/20" style={{ backgroundColor: selectedInstance.properties.Color }} />
                  <span>{selectedInstance.properties.Color}</span>
                </div>
              )}
              {selectedInstance.properties.Material && (
                <div><span className="text-neutral-500">Material:</span> {selectedInstance.properties.Material}</div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setSelectedInstance(null)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
}
