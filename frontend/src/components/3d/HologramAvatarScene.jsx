import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, TorusKnot, Torus } from '@react-three/drei';

const HologramCore = ({ isThinking = false }) => {
  const knotRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    const speed = isThinking ? 2.5 : 1.0;
    const t = state.clock.getElapsedTime();

    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.6 * speed;
      knotRef.current.rotation.y += delta * 0.8 * speed;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2 * speed;
      ringRef.current.rotation.x = Math.sin(t * 2) * 0.4;
    }
  });

  return (
    <group>
      <Float speed={isThinking ? 4 : 2} rotationIntensity={1} floatIntensity={1.2}>
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[0.9, 0.28, 90, 16]} />
          <meshStandardMaterial
            color={isThinking ? '#38BDF8' : '#2563EB'}
            emissive={isThinking ? '#06B6D4' : '#1D4ED8'}
            emissiveIntensity={isThinking ? 1.0 : 0.7}
            roughness={0.1}
            metalness={0.9}
            wireframe
          />
        </mesh>
      </Float>

      <Torus ref={ringRef} args={[1.6, 0.02, 16, 80]}>
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#06B6D4"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </Torus>
    </group>
  );
};

const HologramAvatarScene = ({ isThinking = false, className = 'w-32 h-32' }) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.0} />
        <pointLight position={[5, 5, 5]} intensity={2.0} color="#38BDF8" />
        <pointLight position={[-5, -5, -5]} intensity={1.8} color="#2563EB" />
        <HologramCore isThinking={isThinking} />
      </Canvas>
    </div>
  );
};

export default HologramAvatarScene;
