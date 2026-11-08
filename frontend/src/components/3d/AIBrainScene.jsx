import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

const NeuralBrainCore = () => {
  const outerSphereRef = useRef();
  const innerCoreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.y += delta * 0.4;
      outerSphereRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.6;
      innerCoreRef.current.rotation.z = Math.cos(t * 0.4) * 0.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.y = t * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.4;
      ring2Ref.current.rotation.z = t * 0.35;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.3;
      ring3Ref.current.rotation.z = -t * 0.45;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1;
    }
  });

  // Particle positions
  const particleCount = 180;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.8 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Central Pulsating Distorted Sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere ref={innerCoreRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#2563EB"
            emissive="#1D4ED8"
            emissiveIntensity={0.7}
            roughness={0.1}
            metalness={0.8}
            distort={0.45}
            speed={3}
          />
        </Sphere>
      </Float>

      {/* Outer Wireframe Quantum Lattice */}
      <Sphere ref={outerSphereRef} args={[1.75, 24, 24]}>
        <meshStandardMaterial
          color="#38BDF8"
          wireframe
          transparent
          opacity={0.35}
          emissive="#0284C7"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Orbiting Gyro Rings in Electric Blue & Cyan */}
      <Torus ref={ring1Ref} args={[2.2, 0.03, 16, 100]}>
        <meshStandardMaterial color="#06B6D4" emissive="#0891B2" emissiveIntensity={0.8} />
      </Torus>

      <Torus ref={ring2Ref} args={[2.5, 0.025, 16, 100]}>
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.8} />
      </Torus>

      <Torus ref={ring3Ref} args={[2.8, 0.02, 16, 100]}>
        <meshStandardMaterial color="#3B82F6" emissive="#1E40AF" emissiveIntensity={0.8} />
      </Torus>

      {/* Surrounding Floating Neural Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38BDF8"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const AIBrainScene = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} intensity={1.8} color="#38BDF8" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#2563EB" />
        <pointLight position={[0, 5, -5]} intensity={1.2} color="#1D4ED8" />
        <NeuralBrainCore />
      </Canvas>
    </div>
  );
};

export default AIBrainScene;
