import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function FloatingSpheres() {
  const group = useRef();
  
  useFrame(({ clock }) => {
    group.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={group}>
      {[...Array(10)].map((_, i) => {
        // Create random positions for the spheres
        const radius = Math.random() * 3 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        const z = radius * Math.cos(phi);
        
        const size = Math.random() * 0.5 + 0.2;
        
        return (
          <Sphere key={i} position={[x, y, z]} args={[size, 16, 16]}>
            <meshStandardMaterial 
              color={new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5)} 
              transparent
              opacity={0.7}
              roughness={0.3}
              metalness={0.8}
            />
          </Sphere>
        );
      })}
    </group>
  );
}

function MovingGradient() {
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.2;
    materialRef.current.uniforms.time.value = time;
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[40, 40]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          time: { value: 0 },
          color1: { value: new THREE.Color('#1e1b4b') }, // Indigo 950
          color2: { value: new THREE.Color('#312e81') }, // Indigo 900
          color3: { value: new THREE.Color('#4338ca') }, // Indigo 700
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          varying vec2 vUv;
          
          // Simple noise function
          float noise(vec2 p) {
            return sin(p.x * 10.0) * sin(p.y * 10.0);
          }
          
          void main() {
            vec2 uv = vUv;
            float t = time * 0.5;
            
            // Create waves
            float d = length(uv - vec2(0.5));
            vec2 pos = vec2(
              uv.x + sin(uv.y * 4.0 + t) * 0.1,
              uv.y + sin(uv.x * 4.0 + t) * 0.1
            );
            
            // Create smooth transitions between colors
            float n = noise(pos * 2.0);
            vec3 color = mix(color1, color2, sin(n + t) * 0.5 + 0.5);
            color = mix(color, color3, sin(d * 10.0 - t) * 0.5 + 0.5);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#4338ca" />
        <MovingGradient />
        <FloatingSpheres />
      </Canvas>
    </div>
  );
}