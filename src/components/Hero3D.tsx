import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Torus } from '@react-three/drei';
import * as THREE from 'three';

// A quiet wireframe globe rather than a glowing "AI orb" — reads as a
// precision instrument (radar / network scan) rather than a decoration.
function WireGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.09;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.1, 3]} />
        <meshBasicMaterial color="#14161A" wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function OrbitRing({ radius, speed, color, opacity }: { radius: number; speed: number; color: string; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * speed;
      ref.current.rotation.x = 1.3;
    }
  });
  return (
    <Torus ref={ref} args={[radius, 0.006, 16, 200]}>
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </Torus>
  );
}

function ScanDots() {
  const count = 140;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.4 + Math.random() * 1.4;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.035;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#0E6E7C" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <WireGlobe />
        <OrbitRing radius={3.0} speed={0.12} color="#0E6E7C" opacity={0.35} />
        <OrbitRing radius={3.5} speed={-0.08} color="#C1652E" opacity={0.2} />
        <ScanDots />
      </Canvas>
    </div>
  );
}
